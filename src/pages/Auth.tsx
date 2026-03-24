import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Atom, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getProfile } from '@/lib/supabase-helpers';
import { supabase } from '@/lib/supabase';

type AuthMode = 'signin' | 'signup';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuthStore();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const validatePassword = (pwd: string): string | null => {
    if (!pwd) return 'Password is required';
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Must include at least one uppercase letter';
    if (!/[0-9]/.test(pwd)) return 'Must include at least one number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'Must include at least one special character';
    }
    return null;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    const pwdError = validatePassword(password);
    if (pwdError) newErrors.password = pwdError;

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setGeneralError(error);
          setIsSubmitting(false);
          return;
        }
        // Do not reset isSubmitting; wait for PublicRoute to unmount this component
      } else {
        const { error, needsEmailConfirmation } = await signUpWithEmail(email, password, name);
        if (error) {
          setGeneralError(error);
          setIsSubmitting(false);
          return;
        }
        
        if (needsEmailConfirmation) {
          setSignupSuccess(true);
          setMode('signin');
          setName('');
          setPassword('');
          setConfirmPassword('');
          setIsSubmitting(false);
          return;
        }

        // Do not reset isSubmitting; wait for PublicRoute to unmount this component
      }
    } catch {
      setGeneralError('An unexpected error occurred');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGeneralError('');
    const { error } = await signInWithGoogle();
    if (error) setGeneralError(error);
  };

  const handleForgotPassword = async () => {
    setGeneralError('');
    if (!email.trim()) {
      setErrors({ email: 'Enter your email address to reset your password' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Enter a valid email address' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      if (error) {
        // Never reveal whether the email exists — show generic message
        console.error('Reset error:', error);
      }
      // Always show success to prevent email enumeration attacks
      setResetSent(true);
      setTimeout(() => setResetSent(false), 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Panel: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 border-r border-slate-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        </div>
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-sky-500/8 blur-[100px]" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Atom className="w-10 h-10 text-sky-400" />
            <span className="text-3xl font-bold tracking-wider text-white">PHYSICS.LAB</span>
          </div>
          <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
            Interactive learning platform for JEE &amp; MHT CET aspirants. Master physics
            through simulations, PYQs, and AI-powered analytics.
          </p>

          {/* Physics illustration */}
          <div className="mt-12 relative">
            <div className="w-48 h-48 mx-auto rounded-full border-2 border-dashed border-sky-500/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border border-sky-500/30 flex items-center justify-center animate-pulse">
                <Atom className="w-16 h-16 text-sky-400/50" />
              </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-sky-400/30 font-mono text-xs">
              E = mc²
            </div>
            <div className="absolute bottom-2 right-1/4 text-sky-400/30 font-mono text-xs">
              F = ma
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Atom className="w-7 h-7 text-sky-400" />
            <span className="text-xl font-bold tracking-wider text-white">PHYSICS.LAB</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            {mode === 'signin'
              ? 'Sign in to continue your learning journey'
              : 'Start your JEE/CET preparation today'}
          </p>

          {generalError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
              {generalError}
            </div>
          )}

          {resetSent && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-6">
              If an account exists for {email}, a reset link has been sent. Check your inbox.
            </div>
          )}

          {signupSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3 mb-6">
              Account created! Please check your email to confirm your account before signing in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-colors"
                  placeholder="Min 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 outline-none transition-colors"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sky-400 text-xs hover:text-sky-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle mode */}
          <p className="text-center text-sm text-slate-400 mt-6">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signup');
                    setErrors({});
                    setGeneralError('');
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setMode('signin');
                    setErrors({});
                    setGeneralError('');
                  }}
                  className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                >
                  Sign In
                </button>
              </>
            )}
          </p>

          <div className="mt-8 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
