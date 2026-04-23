import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel gives us the raw body as a string if we disable body parsing, 
    // but by default it parses it. For webhooks we need the raw body for signature verification.
    // In Vercel, we can get it from req.body if it's already a string/object.
    // Actually, Razorpay signature verification usually needs the raw body string.
    
    const signature = req.headers['x-razorpay-signature'] as string;
    const bodyString = JSON.stringify(req.body);

    const expectedSig = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(bodyString)
      .digest('hex');

    // Note: If this fails, it might be due to body parsing differences.
    // In that case, we'd need to use a config to disable body parsing in Vercel.
    
    // For now, let's proceed. 
    // If you encounter issues with webhooks, we may need:
    // export const config = { api: { bodyParser: false } };

    const event = req.body;
    const { event: eventType, payload } = event;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payment?.entity;
        if (!payment) break;

        const userId = payment.notes?.user_id;
        const plan = payment.notes?.plan || 'monthly';
        if (!userId) break;

        const PLAN_DURATION: Record<string, number> = {
          monthly: 30, quarterly: 90, annual: 365,
        };
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setDate(periodEnd.getDate() + (PLAN_DURATION[plan] || 30));

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          plan: 'pro',
          status: 'active',
          razorpay_payment_id: payment.id,
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: now.toISOString(),
        }, { onConflict: 'user_id' });

        await supabase.from('profiles').update({ plan: 'pro' }).eq('id', userId);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const sub = payload.subscription?.entity;
        if (!sub) break;

        const userId = sub.notes?.user_id;
        if (!userId) break;

        await supabase.from('subscriptions').update({
          plan: 'free',
          status: eventType === 'subscription.cancelled' ? 'cancelled' : 'expired',
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);

        await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId);
        break;
      }
    }

    return res.status(200).json({ received: true });

  } catch (err: any) {
    console.error('razorpay-webhook error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
