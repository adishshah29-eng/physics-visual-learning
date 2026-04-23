-- ═══════════════════════════════════════════════════════════════
-- Subscription System Migration — Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Add plan column to profiles ──────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free'
  CHECK (plan IN ('free', 'pro'));

-- ─── 2. Create subscriptions table ───────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  status                  TEXT NOT NULL DEFAULT 'trialing'
                            CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  razorpay_subscription_id TEXT,
  razorpay_payment_id     TEXT,
  current_period_start    TIMESTAMPTZ,
  current_period_end      TIMESTAMPTZ,
  trial_end               TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '10 days'),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ─── 3. RLS on subscriptions ─────────────────────────────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Writes only via service role (Edge Functions)
-- No INSERT/UPDATE policies for authenticated role

-- ─── 4. Auto-insert subscription on new user signup ──────────
-- Triggered by auth.users insert (via Supabase trigger on profiles insert)
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status, trial_end)
  VALUES (NEW.id, 'free', 'trialing', now() + INTERVAL '10 days')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger fires after profile is created (profiles are created on signup)
DROP TRIGGER IF EXISTS on_profile_created_create_subscription ON public.profiles;
CREATE TRIGGER on_profile_created_create_subscription
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_subscription();

-- ─── 5. Updated_at auto-timestamp ────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- ─── 6. Backfill existing users ──────────────────────────────
-- Give existing users a subscription row (trial already expired → free)
INSERT INTO public.subscriptions (user_id, plan, status, trial_end)
SELECT id, 'free', 'active', now() - INTERVAL '1 day'
FROM public.profiles
WHERE id NOT IN (SELECT user_id FROM public.subscriptions)
ON CONFLICT (user_id) DO NOTHING;
