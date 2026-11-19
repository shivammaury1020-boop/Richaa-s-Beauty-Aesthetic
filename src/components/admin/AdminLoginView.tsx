import React, { useState } from 'react';
import {
  ArrowLeft,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { BrandMark } from '../BrandMark';

function formatAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('auth/invalid-credential') || raw.includes('auth/wrong-password')) {
    return 'Incorrect email or password. Please check your credentials and try again.';
  }
  if (raw.includes('auth/user-not-found')) {
    return 'No authorised administrator account was found for that email address.';
  }
  if (raw.includes('auth/operation-not-allowed')) {
    return 'Email & password sign-in is not yet enabled in your Firebase Console. You can sign in immediately using Google below, or enable Email/Password under Firebase Authentication → Sign-in method.';
  }
  if (raw.includes('auth/too-many-requests')) {
    return 'Too many sign-in attempts. Please wait a few minutes or reset your password.';
  }
  if (raw.includes('auth/popup-closed-by-user')) {
    return 'Sign-in window was closed before completing authentication.';
  }
  if (raw.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  return 'Unable to sign in right now. Please try again or sign in with your authorised Google account.';
}

export function AdminLoginView() {
  const {
    adminAuth,
    businessConfig,
    navigate,
    signInAdminWithEmail,
    signInAdminWithGoogle,
    requestAdminPasswordReset,
    signOutAdmin,
  } = useSite();

  const [mode, setMode] = useState<'login' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }
    setSubmitting(true);
    try {
      await signInAdminWithEmail(email, password);
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSent(false);
    if (!email.trim()) {
      setErrorMsg('Please enter your administrator email address.');
      return;
    }
    setSubmitting(true);
    try {
      await requestAdminPasswordReset(email);
      setResetSent(true);
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await signInAdminWithGoogle();
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EE] text-[#382D28] flex flex-col justify-between px-4 py-8 md:py-12">
      <div className="max-w-5xl w-full mx-auto">
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#A58A78] hover:text-[#382D28] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Website
        </button>
      </div>

      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white border border-[#E8D5CA] rounded-2xl p-8 md:p-10 shadow-[0_24px_60px_rgba(56,45,40,0.06)]">
          <div className="flex flex-col items-center text-center mb-8">
            <BrandMark size="md" align="center" logoUrl={businessConfig.logoUrl} />
            <div className="w-10 h-px bg-[#C5A27E] my-5" />
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#A58A78] mb-1.5">
              Authorised Staff Portal
            </p>
            <h1 className="font-serif text-3xl text-[#382D28]">
              {mode === 'login' ? 'Admin Sign In' : 'Reset Password'}
            </h1>
          </div>

          {adminAuth.checkingAdmin && !adminAuth.authReady ? (
            <div className="py-10 text-center text-sm text-[#A58A78]">
              Verifying administrator session...
            </div>
          ) : adminAuth.unauthorizedEmail ? (
            <div className="space-y-5">
              <div className="bg-[#FDF8F4] border border-[#E8D5CA] rounded-xl p-5 text-left">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#382D28] mb-1">
                      Access Restricted
                    </p>
                    <p className="text-xs text-[#6B5A50] leading-relaxed">
                      The signed-in account (
                      <span className="font-medium text-[#382D28]">
                        {adminAuth.unauthorizedEmail}
                      </span>
                      ) is not listed as an authorised salon administrator, or
                      its email address has not been verified.
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void signOutAdmin()}
                className="w-full py-3 px-4 bg-[#382D28] text-white text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#4a3c36] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out &amp; Switch Account
              </button>
            </div>
          ) : mode === 'login' ? (
            <div className="space-y-6">
              {errorMsg && (
                <div
                  role="alert"
                  className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-3 text-xs leading-relaxed"
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#6B5A50] mb-1.5"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A58A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="richaajingar2424@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm text-[#382D28] focus:outline-none focus:border-[#C5A27E] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-[11px] uppercase tracking-[0.14em] text-[#6B5A50]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMsg(null);
                        setResetSent(false);
                      }}
                      className="text-[11px] text-[#A58A78] hover:text-[#382D28] underline underline-offset-2 cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A58A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm text-[#382D28] focus:outline-none focus:border-[#C5A27E] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.16em] rounded-md hover:bg-[#b5916c] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Signing In...' : 'Sign In with Email'}
                </button>
              </form>

              <div className="relative flex items-center py-1">
                <div className="flex-1 border-t border-[#E8D5CA]" />
                <span className="px-3 text-[11px] uppercase tracking-[0.14em] text-[#A58A78]">
                  Or
                </span>
                <div className="flex-1 border-t border-[#E8D5CA]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={submitting}
                className="w-full py-3 px-4 bg-[#F8F3EE] border border-[#E8D5CA] text-[#382D28] text-xs uppercase tracking-[0.14em] rounded-md hover:bg-[#F2E8DF] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#C5A27E] shrink-0" />
                Sign In with Google
              </button>

              <p className="text-[11px] text-[#A58A78] text-center leading-relaxed pt-2">
                Protected salon administration area. Public registration is
                disabled; access is restricted to verified salon owners and
                authorised staff.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {errorMsg && (
                <div
                  role="alert"
                  className="bg-[#FDF3F2] border border-[#E5B8B2] text-[#8A2C22] rounded-lg px-4 py-3 text-xs leading-relaxed"
                >
                  {errorMsg}
                </div>
              )}

              {resetSent && (
                <div className="bg-[#F4F8F4] border border-[#C6DEC7] text-[#2D5A30] rounded-lg px-4 py-3 text-xs leading-relaxed">
                  If an email/password account exists for{' '}
                  <strong>{email}</strong>, a password reset link has been sent
                  to that inbox.
                </div>
              )}

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-[11px] uppercase tracking-[0.14em] text-[#6B5A50] mb-1.5"
                  >
                    Administrator Email Address
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#A58A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="richaajingar2424@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8F3EE]/60 border border-[#E8D5CA] rounded-md text-sm text-[#382D28] focus:outline-none focus:border-[#C5A27E] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#C5A27E] text-white text-xs uppercase tracking-[0.16em] rounded-md hover:bg-[#b5916c] transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Sending Reset Link...' : 'Send Password Reset Email'}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className="w-full text-center text-xs text-[#A58A78] hover:text-[#382D28] transition-colors cursor-pointer"
              >
                Return to Admin Sign In
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-[11px] text-[#A58A78]">
        &copy; {new Date().getFullYear()} {businessConfig.brandName} &middot;
        Secure Administration
      </div>
    </div>
  );
}
