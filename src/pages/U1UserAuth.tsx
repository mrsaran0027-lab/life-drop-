import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Heart,
  User,
  Phone,
  MapPin,
  Lock,
  ArrowRight,
  Mail,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { BloodGroup } from '../types';

export const U1UserAuth: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, signupUser, isAuthenticated, isDoctor } = useApp();

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [city, setCity] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bloodGroupOptions: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isDoctor) {
        navigate('/doctor', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, isDoctor, navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail) {
      setError('Please provide your email address or username.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginUser(loginEmail);
      setLoading(false);
      navigate('/home');
    }, 350);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !city) {
      setError('Please fill in all required registration fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      signupUser({ name, phone, bloodGroup, city });
      setLoading(false);
      navigate('/home');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-between text-slate-800">
      {/* Top Header */}
      <header className="bg-[#1F2A6B] text-white px-6 py-4 shadow-md flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg text-white">
            <Droplets className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">LifeDrop</h1>
            <p className="text-xs text-[#E6E6F2]/80 font-medium">Patient & Donor Community Portal</p>
          </div>
        </div>

        <Link
          to="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-colors border border-white/15"
        >
          <Stethoscope className="w-3.5 h-3.5 text-sky-300" />
          <span>Doctor / Hospital Login</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-lg mx-auto">
          {/* Centered Auth Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header with Mode Toggle (Login vs Create Account) */}
            <div className="bg-[#1F2A6B] p-6 text-white text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                U1 – User Account Portal
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {authMode === 'login' ? 'Welcome Back to LifeDrop' : 'Join as Donor or Patient'}
              </h2>
              <p className="text-xs text-[#E6E6F2]/80 mt-1 max-w-sm mx-auto">
                Request emergency blood, register donor availability, join blood groups, or book appointments.
              </p>

              {/* Sub-toggle between Login and Create Account */}
              <div className="mt-4 inline-flex bg-black/20 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                  className={`py-1.5 px-5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#1F2A6B] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                  }}
                  className={`py-1.5 px-5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Form Area */}
            <div className="p-6 sm:p-8">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {authMode === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address or Phone Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. sarah.jenkins@lifedrop.org"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Signing In...</span>
                    ) : (
                      <>
                        <span>Enter Community Portal (U2)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Create Account Form */
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Michael Chen"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City / Metro
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Metro West"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Blood Group Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Select Blood Group</span>
                      <span className="text-[10px] text-red-600 font-bold">Matching Essential</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodGroupOptions.map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setBloodGroup(bg)}
                          className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            bloodGroup === bg
                              ? 'bg-red-600 text-white border-red-600 shadow-md scale-102'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm bg-[#1F2A6B] hover:bg-[#151c4a] text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <span>Complete Sign Up & Enter Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        LifeDrop System · Blood Donation Matching & Hospital Appointment Platform
      </footer>
    </div>
  );
};
