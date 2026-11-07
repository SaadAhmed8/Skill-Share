// src/components/AuthCard.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Eye,
  EyeSlash,
  ArrowRight,
  CaretDown,
} from '@phosphor-icons/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { CodeOfConductModal } from './CodeOfConductModal';
import { useApp } from '../context/AppContext';
import {
  validateUniversityEmail,
  getPasswordStrength,
  ALLOWED_EMAIL_DOMAIN,
} from '../lib/validators';
import { toast } from 'sonner';

export function AuthCard({ initialTab = 'login', onAuthSuccess, showBecomeMentorLink = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logIn, signUp, users } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [showDemoDetails, setShowDemoDetails] = useState(false);

  // State: Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // State: Sign Up Form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeCode, setAgreeCode] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const strength = getPasswordStrength(signupPassword);
  const isEmailValidDomain = !signupEmail || validateUniversityEmail(signupEmail);

  // Quick Demo Account Filler
  const handleUseDemo = (email, role) => {
    setLoginEmail(email);
    setLoginPassword('Password123');
    toast.info(`Filled credentials for ${role} (${email})`);
  };

  const handleSuccessfulAuth = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
      return;
    }

    // Check redirect target saved in location.state or URL
    const savedRedirect = location.state?.from || new URLSearchParams(location.search).get('redirect');

    if (savedRedirect && savedRedirect !== '/' && savedRedirect !== '/auth') {
      navigate(savedRedirect, { replace: true });
      return;
    }

    if (user.role === 'admin' || user.role === 'mentor') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/mentors', { replace: true });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      toast.error('Please enter your NED university email.');
      return;
    }
    if (!validateUniversityEmail(loginEmail)) {
      toast.error(`University email must end with ${ALLOWED_EMAIL_DOMAIN}`);
      return;
    }

    try {
      const user = logIn(loginEmail, loginPassword);
      toast.success(`Welcome back, ${user.name}!`);
      handleSuccessfulAuth(user);
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !validateUniversityEmail(signupEmail)) {
      toast.error(`A valid university email ending with ${ALLOWED_EMAIL_DOMAIN} is required.`);
      return;
    }
    if (signupPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!agreeCode) {
      toast.error('You must agree to the Code of Conduct to register.');
      return;
    }

    try {
      const user = signUp({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      toast.success(`Account created successfully! Welcome, ${user.name}.`);
      handleSuccessfulAuth(user);
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="w-full bg-[var(--white)] border border-[var(--line)] rounded-[28px] p-6 sm:p-8 shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-start mb-6">
          <TabsList className="bg-[var(--snow)] p-1 rounded-full flex gap-1 border border-[var(--line)]">
            <TabsTrigger
              value="login"
              className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors data-[state=active]:bg-[var(--ink)] data-[state=active]:text-[var(--white)] text-[var(--gray-600)] hover:text-[var(--ink)]"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors data-[state=active]:bg-[var(--ink)] data-[state=active]:text-[var(--white)] text-[var(--gray-600)] hover:text-[var(--ink)]"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: LOGIN */}
        <TabsContent value="login" className="space-y-4 focus-visible:outline-none">
          <div className="text-left">
            <h2 className="font-heading font-bold text-2xl text-[var(--ink)]">
              Welcome back
            </h2>
            <p className="text-xs text-[var(--gray-600)] mt-1">
              Sign in with your verified NED student credentials
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">
                NED University Email <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="email"
                placeholder="student@neduet.edu.pk"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[var(--white)] border border-[var(--line)] focus:border-[var(--green-600)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none"
              />
              <p className="text-[11px] text-[var(--gray-600)]">Must end with @neduet.edu.pk</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[var(--ink)]">
                  Password <span className="text-[var(--error)]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-[var(--green-600)] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[var(--white)] border border-[var(--line)] focus:border-[var(--green-600)] rounded-[14px] px-3.5 py-2.5 pr-10 text-xs text-[var(--ink)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-600)] hover:text-[var(--ink)]"
                >
                  {showLoginPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[var(--gray-600)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded size-3.5 accent-[var(--ink)]"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[var(--ink)] hover:bg-[#222222] text-[var(--white)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="size-3.5" weight="bold" />
            </button>
          </form>

          {/* Demo Accounts Helper Box (Collapsed by default per spec 1.2) */}
          <div className="rounded-[14px] border border-[var(--line)] bg-[var(--snow)] p-3 text-xs text-left">
            <button
              type="button"
              onClick={() => setShowDemoDetails(!showDemoDetails)}
              className="w-full flex items-center justify-between text-left font-semibold text-[var(--ink)] cursor-pointer"
            >
              <span>Demo Accounts (Instant Fill)</span>
              <CaretDown className={`size-3.5 transition-transform ${showDemoDetails ? 'rotate-180' : ''}`} weight="bold" />
            </button>

            {showDemoDetails && (
              <div className="pt-2 space-y-1.5 border-t border-[var(--line)] mt-2">
                {users.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleUseDemo(u.email, u.role)}
                    className="w-full flex items-center justify-between p-1.5 rounded-[8px] bg-[var(--white)] border border-[var(--line)] hover:border-[var(--ink)] transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold text-[var(--ink)] text-[11px]">{u.name}</p>
                      <p className="text-[10px] text-[var(--gray-600)]">{u.email}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[var(--green-600)]">{u.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: SIGN UP */}
        <TabsContent value="signup" className="space-y-4 focus-visible:outline-none">
          <div className="text-left">
            <h2 className="font-heading font-bold text-2xl text-[var(--ink)]">
              Create an account
            </h2>
            <p className="text-xs text-[var(--gray-600)] mt-1">
              Join the official peer tutoring network for NED students
            </p>
          </div>

          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">
                Full Name <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ayesha Siddiqui"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="w-full bg-[var(--white)] border border-[var(--line)] focus:border-[var(--green-600)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">
                NED University Email <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="email"
                placeholder="student@neduet.edu.pk"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className={`w-full bg-[var(--white)] border rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none ${
                  !isEmailValidDomain
                    ? 'border-[var(--error)] focus:border-[var(--error)]'
                    : 'border-[var(--line)] focus:border-[var(--green-600)]'
                }`}
              />
              {!isEmailValidDomain && (
                <p className="text-[11px] text-[var(--error)]">
                  Must end with @{ALLOWED_EMAIL_DOMAIN}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">
                Password <span className="text-[var(--error)]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="w-full bg-[var(--white)] border border-[var(--line)] focus:border-[var(--green-600)] rounded-[14px] px-3.5 py-2.5 pr-10 text-xs text-[var(--ink)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-600)] hover:text-[var(--ink)]"
                >
                  {showSignupPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {signupPassword && (
                <div className="space-y-1 pt-1">
                  <div className="h-1 w-full bg-[var(--snow)] rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.score / 3) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-[var(--gray-600)]">{strength.label}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--ink)]">
                Confirm Password <span className="text-[var(--error)]">*</span>
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                className="w-full bg-[var(--white)] border border-[var(--line)] focus:border-[var(--green-600)] rounded-[14px] px-3.5 py-2.5 text-xs text-[var(--ink)] outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-xs text-[var(--gray-600)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeCode}
                  onChange={(e) => setAgreeCode(e.target.checked)}
                  className="mt-0.5 rounded size-3.5 accent-[var(--ink)]"
                />
                <span>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCodeModal(true);
                    }}
                    className="text-[var(--ink)] underline font-semibold cursor-pointer"
                  >
                    Code of Conduct
                  </button>{' '}
                  and university safety rules.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[var(--ink)] hover:bg-[#222222] text-[var(--white)] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <span>Create Account</span>
              <ArrowRight className="size-3.5" weight="bold" />
            </button>
          </form>
        </TabsContent>
      </Tabs>

      {/* Small text link below the form: Want to teach? Become a mentor */}
      {showBecomeMentorLink && (
        <div className="pt-4 border-t border-[var(--line)] mt-4 text-center">
          <Link
            to="/become-a-mentor"
            className="text-xs font-semibold text-[var(--gray-600)] hover:text-[var(--green-600)] transition-colors"
          >
            Want to teach? Become a mentor
          </Link>
        </div>
      )}

      {/* Code of Conduct Modal */}
      <CodeOfConductModal open={showCodeModal} onOpenChange={setShowCodeModal} />

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--white)] border border-[var(--line)] rounded-[20px] p-6 max-w-sm w-full space-y-3 text-center">
            <h3 className="font-heading font-semibold text-lg text-[var(--ink)]">
              Forgot Password
            </h3>
            <p className="text-xs text-[var(--gray-600)] leading-relaxed">
              In this prototype demonstration, passwords are fixed for demo accounts (<code className="bg-[var(--snow)] px-1 rounded">Password123</code>). You can log in using any listed demo account on the sign-in form.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="px-5 py-2 rounded-full bg-[var(--ink)] text-[var(--white)] text-xs font-semibold cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
