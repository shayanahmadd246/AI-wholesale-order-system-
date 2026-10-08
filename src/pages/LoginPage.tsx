import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { registerClientApi } from '../api/auth';
import { Store, Factory, Shield, ArrowRight, Lock, User, AlertCircle, Phone, CreditCard, UserPlus, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { BackButton } from '../components/common/BackButton';

interface LoginPageProps {
  targetRole: Role;
}

export const LoginPage: React.FC<LoginPageProps> = ({ targetRole }) => {
  const { login } = useAuth();

  // Mode state for Client role (Sign In vs Sign Up)
  const [isSignUp, setIsSignUp] = useState(false);

  // Sign In State
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Sign Up State (Client Only)
  const [shopNameInput, setShopNameInput] = useState('');
  const [ownerNameInput, setOwnerNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [cnicInput, setCnicInput] = useState('');
  const [signUpPasswordInput, setSignUpPasswordInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roleConfig = {
    client: {
      title: isSignUp ? 'Create Client Account' : 'Client Shopkeeper Login',
      sub: isSignUp
        ? 'Register your retail or wholesale store to start ordering supplies via AI voice & text.'
        : 'Sign in to access your AI ordering assistant, order timeline, and credit ledger.',
      icon: Store,
      badge: 'Client Portal',
      fieldLabel: 'Registered Phone Number',
      fieldPlaceholder: '+92 300 5550192'
    },
    supplier: {
      title: 'Supplier Partner Portal',
      sub: 'Log in to manage stock levels, update wholesale prices, and fulfill client orders.',
      icon: Factory,
      badge: 'Supplier Access',
      fieldLabel: 'Company Email / Name',
      fieldPlaceholder: 'Khyber.agri@wholesale.pk'
    },
    admin: {
      title: 'Central Wholesaler Admin',
      sub: 'Protected Admin Portal. Restricted exclusively to authorized central administration.',
      icon: Shield,
      badge: 'Protected Master Access',
      fieldLabel: 'Admin Email',
      fieldPlaceholder: 'shayan@gmail.com'
    }
  };

  const config = roleConfig[targetRole];
  const Icon = config.icon;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const u = await login(targetRole, identifierInput, passwordInput);
      window.location.href = `/${u.role}`;
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const u = await registerClientApi({
        shopName: shopNameInput,
        name: ownerNameInput,
        phone: phoneInput,
        cnicNumber: cnicInput,
        password: signUpPasswordInput
      });
      window.location.href = `/${u.role}`;
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex font-sans text-[#1A1918]">
      {/* 1. Left Visual Section (Luxury Charcoal & Metallic Gold Split Screen) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] text-[#FAF7F2] p-12 xl:p-16 flex-col justify-between relative overflow-hidden border-r border-[#262422]">
        {/* Subtle Brand Logo Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059] text-[#0F0F0F] flex items-center justify-center font-bold font-display text-sm shadow-lg">
            AI
          </div>
          <div>
            <span className="font-display font-bold text-base tracking-tight text-[#FAF7F2] block">
              Al-Madina AI Wholesale
            </span>
            <span className="text-xs text-[#C5A059] font-medium uppercase tracking-wider">Enterprise Suite</span>
          </div>
        </div>

        {/* Large Editorial Headline & Description */}
        <div className="max-w-lg space-y-6 relative z-10 my-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] text-xs font-semibold rounded-lg tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Multilingual AI Voice & Text
          </span>

          <h1 className="text-4xl xl:text-5xl font-extrabold font-display leading-[1.1] tracking-tight text-[#FAF7F2]">
            Executive AI Wholesale Intelligence
          </h1>

          <p className="text-sm text-[#A39E93] leading-relaxed font-normal">
            A high-performance B2B platform connecting shopkeepers, suppliers, and central wholesalers with natural Pashto, Urdu, and English AI speech ordering.
          </p>

          {/* Minimal Key Numbers Metrics Box */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#262422]">
            <div className="p-4 bg-[#1C1A18] rounded-xl border border-[#2A2825]">
              <span className="text-xs text-[#A39E93] font-medium uppercase tracking-wider block">Languages</span>
              <span className="text-2xl font-bold font-display text-[#FAF7F2] mt-1 block">3 Languages</span>
              <span className="text-[11px] text-[#C5A059]">Pashto · Urdu · English</span>
            </div>

            <div className="p-4 bg-[#1C1A18] rounded-xl border border-[#2A2825]">
              <span className="text-xs text-[#A39E93] font-medium uppercase tracking-wider block">Security</span>
              <span className="text-2xl font-bold font-display text-[#C5A059] mt-1 block">CNIC Verified</span>
              <span className="text-[11px] text-[#A39E93]">Strict Credit Ledger</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-[#A39E93] relative z-10 flex items-center justify-between border-t border-[#262422] pt-6">
          <span>© 2026 Al-Madina AI Corporation</span>
          <span className="text-[#C5A059] font-medium">Luxury SaaS Architecture</span>
        </div>
      </div>

      {/* 2. Right Form Section */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex items-center justify-between pb-6 border-b border-[#EAE5D9]">
          <BackButton to="/" label="Portals" className="bg-white hover:bg-[#FAF7F2] text-[#1A1918] border-[#EAE5D9]" />
          <LanguageSwitcher />
        </header>

        {/* Main Form Box */}
        <main className="my-auto py-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-[#FAF4E6] text-[#C5A059] border border-[#E8D7B0] text-[11px] font-bold uppercase rounded-md tracking-wider">
                  {config.badge}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold font-display text-[#1A1918] tracking-tight">
                {config.title}
              </h2>
              <p className="text-xs text-[#78716C] mt-1.5 leading-relaxed">{config.sub}</p>
            </div>

            {/* Toggle Tab for Client Role (Sign In vs Sign Up) */}
            {targetRole === 'client' && (
              <div className="flex items-center bg-[#EAE5D9]/70 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    !isSignUp ? 'bg-white text-[#1A1918] shadow-xs' : 'text-[#78716C] hover:text-[#1A1918]'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setErrorMessage(null); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    isSignUp ? 'bg-white text-[#1A1918] shadow-xs' : 'text-[#78716C] hover:text-[#1A1918]'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Create Account (Sign Up)</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-stone-100 border border-stone-300 rounded-xl text-[#1A1918] text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C5A059] mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            {/* SIGN IN FORM */}
            {!isSignUp && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1.5">
                    {config.fieldLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifierInput}
                      onChange={e => setIdentifierInput(e.target.value)}
                      placeholder={config.fieldPlaceholder}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] placeholder:text-[#A39E93] outline-none transition-colors font-medium shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] placeholder:text-[#A39E93] outline-none transition-colors font-medium shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 btn-gold rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to {targetRole.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4 text-[#0F0F0F]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SIGN UP FORM (CLIENT ONLY) */}
            {isSignUp && targetRole === 'client' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1">
                    Store / Shop Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shopNameInput}
                    onChange={e => setShopNameInput(e.target.value)}
                    placeholder="e.g. Madina Super Wholesale Store"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] outline-none font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1">
                    Owner / Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerNameInput}
                    onChange={e => setOwnerNameInput(e.target.value)}
                    placeholder="e.g. Khan Muhammad"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] outline-none font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      placeholder="+92 300 0000000"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] outline-none font-medium shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1">
                    CNIC Number (National ID)
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={cnicInput}
                      onChange={e => setCnicInput(e.target.value)}
                      placeholder="17301-1234567-1"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] font-mono outline-none shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1918] mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={signUpPasswordInput}
                      onChange={e => setSignUpPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#EAE5D9] focus:border-[#C5A059] rounded-xl text-xs text-[#1A1918] outline-none font-medium shadow-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 btn-gold rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Create Account & Enter</span>
                      <ArrowRight className="w-4 h-4 text-[#0F0F0F]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="pt-6 border-t border-[#EAE5D9] text-center text-xs text-[#78716C]">
          Al-Madina AI Wholesale Platform — Credentials Secured Portal
        </footer>
      </div>
    </div>
  );
};
