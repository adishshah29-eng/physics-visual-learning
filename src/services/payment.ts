import { PRICING, type PricingPlan } from '@/lib/supabase';

// ─── Razorpay global type ──────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: any;
  }
}

// ─── Load Razorpay script dynamically ─────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── API URLs ──────────────────────────────────────────────────────────────────

function apiUrl(name: string): string {
  // Use relative path for Vercel functions
  return `/api/${name}`;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CheckoutOptions {
  plan: PricingPlan;
  user: { id: string; email: string; name: string };
  onSuccess: () => void | Promise<void>;
  onError: (message: string) => void;
  onDismiss: () => void;
}

// ─── Create Order via Edge Function ───────────────────────────────────────────

async function createOrder(plan: PricingPlan): Promise<{ orderId: string; amount: number }> {
  const { data: { session } } = await import('@/lib/supabase').then(m =>
    m.supabase.auth.getSession()
  );
  if (!session?.access_token) throw new Error('Not authenticated');

  const res = await fetch(apiUrl('create-order'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ plan }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Failed to create order (${res.status})`);
  }

  return res.json();
}

// ─── Verify Payment via Edge Function ─────────────────────────────────────────

async function verifyPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: PricingPlan;
}): Promise<void> {
  const { data: { session } } = await import('@/lib/supabase').then(m =>
    m.supabase.auth.getSession()
  );
  if (!session?.access_token) throw new Error('Not authenticated');

  const res = await fetch(apiUrl('verify-payment'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Verification failed' }));
    throw new Error(err.error || 'Payment verification failed');
  }
}

// ─── Main Checkout Function ────────────────────────────────────────────────────

export async function openRazorpayCheckout(options: CheckoutOptions): Promise<void> {
  const { plan, user, onSuccess, onError, onDismiss } = options;

  // 1. Load Razorpay SDK
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onError('Could not load payment gateway. Please check your connection.');
    return;
  }

  // 2. Create order on server
  let orderId: string;
  let amount: number;
  try {
    const result = await createOrder(plan);
    orderId = result.orderId;
    amount = result.amount;
  } catch (err: any) {
    onError(err.message || 'Failed to initialize payment.');
    return;
  }

  const pricing = PRICING[plan];

  // 3. Open Razorpay modal
  const rzp = new window.Razorpay({
    key: import.meta.env.VITE_RAZORPAY_KEY_ID as string,
    amount,
    currency: 'INR',
    name: 'Physics.Lab',
    description: `Pro ${plan.charAt(0).toUpperCase() + plan.slice(1)} — ${pricing.label}`,
    order_id: orderId,
    prefill: {
      name: user.name,
      email: user.email,
    },
    theme: {
      color: '#7C3AED', // violet-600
      backdrop_color: '#05060c',
    },
    modal: {
      ondismiss: onDismiss,
    },
    handler: async (response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      try {
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          plan,
        });
        await onSuccess();
      } catch (err: any) {
        onError(err.message || 'Payment verification failed. Contact support.');
      }
    },
  });

  rzp.open();
}
