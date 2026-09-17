import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export const LoginPage: React.FC = () => {
  const { setActiveTab, login, isAuthLoading, authError } = usePlatform();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field validation errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showForgotNote, setShowForgotNote] = useState(false);

  const validateEmail = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setEmailError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('Please enter your password.');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setShowForgotNote(false);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const res = await login(email.trim(), password);
    if (!res.success) {
      setFormError(res.error || 'Incorrect email or password.');
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('karthikeyanng4@gmail.com');
    setPassword('SecurePass@2025');
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);
    setShowForgotNote(false);

    const res = await login('karthikeyanng4@gmail.com', 'SecurePass@2025');
    if (!res.success) {
      setFormError(res.error || 'Unable to sign in with demo credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[250px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 z-10">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-2.5 group cursor-pointer transition-transform hover:scale-105"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Leaf className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="text-left">
            <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight block">
              EcoCommunity
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold tracking-wide uppercase">
              Climate Action Platform
            </span>
          </div>
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-white tracking-tight pt-2">
          Welcome back to your portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          Access your verified action ledger, collective neighborhood score, and local environmental ledger.
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Top Form Alert (Errors or info) */}
          {(formError || authError) && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-bold text-rose-900 dark:text-rose-200">Authentication Failed</p>
                <p>{formError || authError}</p>
              </div>
            </div>
          )}

          {showForgotNote && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Account Recovery Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                To protect local climate ledger integrity, please contact your community administrator or reach us at <strong className="text-emerald-950 dark:text-emerald-200">support@ecocommunity.in</strong> for credential recovery.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    emailError
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-emerald-500'
                  } rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotNote(!showForgotNote)}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    passwordError
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-emerald-500'
                  } rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-hidden cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 border-slate-300 dark:border-slate-600"
                />
                <span className="hover:text-slate-800 dark:hover:text-slate-200">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAuthLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Instant Demo Sign-In Pill for Evaluators & Testing */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center space-y-2.5">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Judging or Testing Demo?</span>
            </div>
            <button
              id="demo-signin-btn"
              type="button"
              onClick={handleDemoSignIn}
              disabled={isAuthLoading}
              className="w-full py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:bg-emerald-200 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>⚡ Instant Demo Sign-In (Karthik Subramanian, Coimbatore)</span>
            </button>
          </div>

          {/* Switch to Sign Up */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Don't have an account? </span>
            <button
              id="switch-to-register-btn"
              type="button"
              onClick={() => setActiveTab('register')}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
