import React, { useState, useMemo } from 'react';
import {
  Leaf,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

interface CountryCodeOption {
  code: string;
  flag: string;
  country: string;
}

const COUNTRY_CALLING_CODES: CountryCodeOption[] = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'United States' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+1', flag: '🇨🇦', country: 'Canada' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+81', flag: '🇯🇵', country: 'Japan' },
  { code: '+60', flag: '🇲🇾', country: 'Malaysia' },
  { code: '+31', flag: '🇳🇱', country: 'Netherlands' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+64', flag: '🇳🇿', country: 'New Zealand' },
  { code: '+41', flag: '🇨🇭', country: 'Switzerland' },
];

export const RegisterPage: React.FC = () => {
  const { setActiveTab, communities, register, isAuthLoading, authError } = usePlatform();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState(
    communities.length > 0 ? communities[0].id : 'comm_cbe_01'
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);

  // Field validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password requirements checks
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.minLength) score += 1;
    if (passwordCriteria.hasUpper) score += 1;
    if (passwordCriteria.hasLower) score += 1;
    if (passwordCriteria.hasNumber) score += 1;
    return score;
  }, [passwordCriteria]);

  const passwordStrengthLabel = useMemo(() => {
    if (!password) return '';
    if (passwordScore <= 2) return 'Weak';
    if (passwordScore === 3) return 'Medium';
    return 'Strong';
  }, [password, passwordScore]);

  const validateName = (val: string): boolean => {
    if (!val.trim()) {
      setNameError('Please enter your full name.');
      return false;
    }
    if (val.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      return false;
    }
    setNameError(null);
    return true;
  };

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

  const validatePhone = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setPhoneError('Please enter your phone number.');
      return false;
    }
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      setPhoneError('Please enter a valid phone number (7 to 15 digits).');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const validatePassword = (val: string): boolean => {
    if (!val) {
      setPasswordError('Please enter your password.');
      return false;
    }
    if (val.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      return false;
    }
    if (!/[A-Z]/.test(val) || !/[a-z]/.test(val) || !/[0-9]/.test(val)) {
      setPasswordError('Include uppercase, lowercase, and at least one number.');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const validateConfirmPassword = (val: string): boolean => {
    if (!val) {
      setConfirmError('Please re-enter your password.');
      return false;
    }
    if (val !== password) {
      setConfirmError('Passwords do not match.');
      return false;
    }
    setConfirmError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const isNameValid = validateName(fullName);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!consentAgreed) {
      setConsentError('You must agree to the genuine evidence transparency guidelines.');
      return;
    } else {
      setConsentError(null);
    }

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmValid) {
      return;
    }

    const res = await register({
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      phone: phone.trim(),
      countryCode: countryCode,
      communityId: selectedCommunityId,
    });

    if (res.success) {
      setSuccessMessage('Account created successfully! Welcome to the Climate Action Platform.');
    } else {
      setFormError(res.error || 'Registration failed. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Ambient background lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[250px] bg-teal-400/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3 z-10">
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
          Create Your Verified Climate Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Connect your everyday choices with your local neighborhood collective for traceable, verified community-level impact.
        </p>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-emerald-950 dark:text-emerald-200">{successMessage}</p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-0.5">Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Form Error Banner */}
          {(formError || authError) && !successMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <p className="font-bold text-rose-900 dark:text-rose-200">Registration Error</p>
                <p>{formError || authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) validateName(e.target.value);
                  }}
                  onBlur={() => validateName(fullName)}
                  placeholder="e.g. Karthik Subramanian"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                    nameError
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-emerald-500'
                  } rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all`}
                />
              </div>
              {nameError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="reg-email" className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-email"
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

            {/* Phone Number with International Calling Code Selector */}
            <div>
              <label htmlFor="reg-phone" className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* International Country Calling-Code Selector */}
                <div className="sm:col-span-5">
                  <label htmlFor="country-calling-code-select" className="sr-only">
                    Country Calling Code
                  </label>
                  <select
                    id="country-calling-code-select"
                    aria-label="Country Calling Code"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all cursor-pointer"
                  >
                    {COUNTRY_CALLING_CODES.map((item, idx) => (
                      <option key={`${item.code}-${idx}`} value={item.code} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                        {item.flag} {item.country} ({item.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Number Input */}
                <div className="relative sm:col-span-7">
                  <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-phone"
                    type="tel"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) validatePhone(e.target.value);
                    }}
                    onBlur={() => validatePhone(phone)}
                    placeholder="9842104592"
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                      phoneError
                        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-emerald-500'
                    } rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all`}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                <span>International country calling code. Used for SMS action certificates.</span>
              </div>
              {phoneError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  <span>{phoneError}</span>
                </p>
              )}
            </div>

            {/* Local Community Collective Selector */}
            <div>
              <label htmlFor="reg-community" className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Your Local Community Collective
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  id="reg-community"
                  value={selectedCommunityId}
                  onChange={(e) => setSelectedCommunityId(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-medium focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all cursor-pointer"
                >
                  {communities.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                      {c.name} ({c.district}, {c.state || 'Tamil Nadu'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Password */}
              <div>
                <label htmlFor="reg-password" className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                      if (confirmPassword) {
                        if (e.target.value !== confirmPassword) {
                          setConfirmError('Passwords do not match.');
                        } else {
                          setConfirmError(null);
                        }
                      }
                    }}
                    onBlur={() => validatePassword(password)}
                    placeholder="Min. 8 characters"
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
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm-password" className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (confirmError) validateConfirmPassword(e.target.value);
                    }}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border ${
                      confirmError
                        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/40 focus:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800/90 focus:border-emerald-500 focus:ring-emerald-500'
                    } rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-hidden cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Field Errors */}
            {passwordError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{passwordError}</span>
              </p>
            )}
            {confirmError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" />
                <span>{confirmError}</span>
              </p>
            )}

            {/* Live Password Strength Meter */}
            {password.length > 0 && (
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Password Strength:</span>
                  <span
                    className={`font-bold ${
                      passwordScore <= 2
                        ? 'text-rose-600 dark:text-rose-400'
                        : passwordScore === 3
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {passwordStrengthLabel}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full flex-1 rounded-full transition-all ${
                      passwordScore >= 1
                        ? passwordScore <= 2
                          ? 'bg-rose-500'
                          : passwordScore === 3
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all ${
                      passwordScore >= 2
                        ? passwordScore <= 2
                          ? 'bg-rose-500'
                          : passwordScore === 3
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all ${
                      passwordScore >= 3
                        ? passwordScore === 3
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full transition-all ${
                      passwordScore >= 4 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                </div>

                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.minLength ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.minLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.hasUpper ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.hasUpper ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    <span>Uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.hasLower ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.hasLower ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    <span>Lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.hasNumber ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                    <CheckCircle2 className={`w-3 h-3 ${passwordCriteria.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    <span>One number</span>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Evidence Verification Consent */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <label className="flex items-start gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => {
                    setConsentAgreed(e.target.checked);
                    if (e.target.checked) setConsentError(null);
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5 border-slate-300 dark:border-slate-600"
                />
                <span className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                  I agree to submit genuine environmental action evidence and consent to automated verification under platform transparency protocols.
                </span>
              </label>
              {consentError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium pl-6">
                  <AlertCircle className="w-3 h-3" />
                  <span>{consentError}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={isAuthLoading || !!successMessage}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAuthLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration & Launch Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Already have an account? </span>
            <button
              id="switch-to-login-btn"
              type="button"
              onClick={() => setActiveTab('login')}
              className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
