// supabase/functions/razorpay-webhook/index.ts
// Handles Razorpay lifecycle events: payment.captured, subscription.cancelled, subscription.expired

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!;
const SUPABASE_URL            = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY    = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'x-razorpay-signature, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    // 1. Verify webhook signature
    const expectedSig = hmac('sha256', RAZORPAY_WEBHOOK_SECRET, bodyText, 'utf8', 'hex') as string;
    if (expectedSig !== signature) {
      console.error('Webhook signature mismatch');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const event = JSON.parse(bodyText);
    const { event: eventType, payload } = event;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 2. Handle events
    switch (eventType) {
      case 'payment.captured': {
        const payment = payload.payment?.entity;
        if (!payment) break;

        const userId = payment.notes?.user_id;
        const plan   = payment.notes?.plan || 'monthly';
        if (!userId) break;

        // Idempotency: skip if already processed
        const { data: existing } = await supabase
          .from('subscriptions')
          .select('razorpay_payment_id')
          .eq('user_id', userId)
          .single();

        if ((existing as any)?.razorpay_payment_id === payment.id) {
          console.log('payment.captured: already processed', payment.id);
          break;
        }

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
        console.log('payment.captured: upgraded user', userId);
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const sub = payload.subscription?.entity;
        if (!sub) break;

        const userId = sub.notes?.user_id;
        if (!userId) break;

        const newStatus = eventType === 'subscription.cancelled' ? 'cancelled' : 'expired';

        await supabase.from('subscriptions').update({
          plan: 'free',
          status: newStatus,
          updated_at: new Date().toISOString(),
        }).eq('user_id', userId);

        await supabase.from('profiles').update({ plan: 'free' }).eq('id', userId);
        console.log(`${eventType}: downgraded user`, userId);
        break;
      }

      default:
        console.log('Unhandled webhook event:', eventType);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    console.error('razorpay-webhook error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
