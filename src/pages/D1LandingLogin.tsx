import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  ShieldCheck,
  Stethoscope,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  User,
  AlertCircle,
  Phone,
  MapPin,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { ToastContainer } from '../components/common/ToastContainer';
import { BloodGroup } from '../types';

export const D1LandingLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginDoctor, loginUser, signupUser, isAuthenticated, isDoctor } = useApp();

  // Selected tab: 'doctor' | 'user'
  const [activeTab, setActiveTab] = useState<'doctor' | 'user'>('doctor');

  // Doctor Form Fields
  const [docEmail, setDocEmail] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [hospitalFacilityId, setHospitalFacilityId] = useState('');
  const [facilityType, setFacilityType] = useState<'Hospital' | 'Verified Doctor' | 'Blood Bank'>('Hospital');

  // User Form Fields
  const [userAuthMode, setUserAuthMode] = useState<'login' | 'signup'>('login');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userBloodGroup, setUserBloodGroup] = useState<BloodGroup>('O+');
  const [userCity, setUserCity] = useState('');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const bloodGroupOptions: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // If already authenticated, redirect to respective dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isDoctor) {
        navigate('/doctor', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [isAuthenticated, isDoctor, navigate]);

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!docEmail || !licenseId) {
      setFormError('Please provide both verified Email and Medical License / Facility ID.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginDoctor(docEmail, licenseId);
      setLoading(false);
      navigate('/doctor');
    }, 350);
  };

  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!userEmail) {
      setFormError('Please enter your email or username.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginUser(userEmail);
      setLoading(false);
      navigate('/home');
    }, 350);
  };

  const handleUserSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!userName || !userPhone || !userCity) {
      setFormError('Please fill in all registration fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      signupUser({
        name: userName,
        phone: userPhone,
        bloodGroup: userBloodGroup,
        city: userCity,
      });
      setLoading(false);
      navigate('/home');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-between text-slate-800">
      <ToastContainer />

      {/* Top Header Banner */}
      <header className="bg-[#1F2A6B] text-white px-6 py-4 shadow-md flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg text-white">
            <Droplets className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">LifeDrop</h1>
            <p className="text-xs text-[#E6E6F2]/80 font-medium">Blood Donation & Medical Appointments Platform</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl mx-auto">
          {/* Top 2-Portal Selection Switch */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-full bg-white p-1.5 rounded-2xl border-2 border-[#1F2A6B]/20 shadow-sm flex items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('doctor');
                  setFormError('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'doctor'
                    ? 'bg-[#1F2A6B] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-sky-300" />
                <span>Admin & Doctor Login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('user');
                  setFormError('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'user'
                    ? 'bg-[#1F2A6B] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-red-500" />
                <span>Patient & User Login</span>
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500 font-medium">
              Select your role portal to sign in. Once inside, portals are strictly separated for medical security.
            </p>
          </div>

          {/* DOCTOR / HOSPITAL LOGIN PORTAL */}
          {activeTab === 'doctor' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
              {/* Header Accent */}
              <div className="bg-[#1F2A6B] px-6 py-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-sky-200">
                    D1 – Verified Medical Portal
                  </span>
                  <h2 className="text-lg font-bold text-white">
                    Doctor & Hospital Sign In
                  </h2>
                </div>

                {/* Verification Badge Slot */}
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Verified Access</span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6 bg-[#E6E6F2]/60 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#1F2A6B] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#1F2A6B]">Verified Clinical Authority</p>
                    <p className="text-slate-600 mt-0.5">
                      Doctors and hospitals sign in to review patient appointments, confirm available consultation time slots, and supervise blood logistics.
                    </p>
                  </div>
                </div>

                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleDoctorSubmit} className="space-y-4">
                  {/* Facility Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Institution Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Hospital', 'Verified Doctor', 'Blood Bank'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFacilityType(type)}
                          className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                            facilityType === type
                              ? 'bg-[#1F2A6B] text-white border-[#1F2A6B] shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Doctor Email / Hospital ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        placeholder="e.g. dr.vance@stjudemedical.org"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Doctor Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={docPassword}
                        onChange={(e) => setDocPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* License & Facility Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Medical License #
                      </label>
                      <input
                        type="text"
                        value={licenseId}
                        onChange={(e) => setLicenseId(e.target.value)}
                        placeholder="e.g. MD-94021-TX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Hospital Facility Code
                      </label>
                      <input
                        type="text"
                        value={hospitalFacilityId}
                        onChange={(e) => setHospitalFacilityId(e.target.value)}
                        placeholder="e.g. FAC-STJUDE-409"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#1F2A6B] to-[#2D3D94] hover:from-[#192358] hover:to-[#243177] text-white shadow-lg shadow-[#1F2A6B]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Verifying Credentials...</span>
                    ) : (
                      <>
                        <span>Enter Doctor Dashboard (D2)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* USER / PATIENT & DONOR LOGIN PORTAL */}
          {activeTab === 'user' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
              {/* Header Accent */}
              <div className="bg-[#1F2A6B] p-6 text-white text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                  U1 – Community Care Portal
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {userAuthMode === 'login' ? 'Patient & Donor Sign In' : 'Create LifeDrop Account'}
                </h2>
                <p className="text-xs text-[#E6E6F2]/80 mt-1 max-w-sm mx-auto">
                  Request emergency blood, register donor availability, join blood groups, or book appointments.
                </p>

                {/* Sub-toggle: Login vs Sign Up */}
                <div className="mt-4 inline-flex bg-black/20 p-1 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setUserAuthMode('login');
                      setFormError('');
                    }}
                    className={`py-1.5 px-5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userAuthMode === 'login'
                        ? 'bg-white text-[#1F2A6B] shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserAuthMode('signup');
                      setFormError('');
                    }}
                    className={`py-1.5 px-5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      userAuthMode === 'signup'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {formError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {userAuthMode === 'login' ? (
                  /* User Login Form */
                  <form onSubmit={handleUserLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address or Phone Number
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
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
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
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
                          <span>Enter User Community Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* User Registration Form */
                  <form onSubmit={handleUserSignupSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Emily Watson"
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
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            placeholder="+1 (555) 019-4821"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City / Region
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={userCity}
                            onChange={(e) => setUserCity(e.target.value)}
                            placeholder="e.g. Boston Metro"
                            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none text-sm transition-all bg-white"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Blood Group Picker */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Your Blood Group</span>
                        <span className="text-[10px] text-red-600 font-bold">Important for Matching</span>
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {bloodGroupOptions.map((bg) => (
                          <button
                            key={bg}
                            type="button"
                            onClick={() => setUserBloodGroup(bg)}
                            className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                              userBloodGroup === bg
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
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
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
                        <span>Registering Account...</span>
                      ) : (
                        <>
                          <span>Create Account & Enter Portal</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        LifeDrop System · Blood Donation Matching & Hospital Appointment Platform
      </footer>
    </div>
  );
};
