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
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeftRight,
} from 'lucide-react';
import { ToastContainer } from '../components/common/ToastContainer';

export const D1LandingLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginDoctor, switchUserRole } = useApp();

  // Selected tab: 'doctor' | 'user'
  const [activeTab, setActiveTab] = useState<'doctor' | 'user'>('doctor');

  // Doctor Form Fields
  const [docEmail, setDocEmail] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [hospitalFacilityId, setHospitalFacilityId] = useState('');
  const [facilityType, setFacilityType] = useState<'Hospital' | 'Verified Doctor' | 'Blood Bank'>('Hospital');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleTabSwitch = (tab: 'doctor' | 'user') => {
    setActiveTab(tab);
    setFormError('');
    if (tab === 'user') {
      switchUserRole('user');
      navigate('/auth');
    }
  };

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
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-between text-slate-800">
      <ToastContainer />

      {/* Top Navigation Banner */}
      <header className="bg-[#1F2A6B] text-white px-6 py-4 shadow-md flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg text-white">
            <Droplets className="w-6 h-6 fill-white text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">LifeDrop</h1>
            <p className="text-xs text-[#E6E6F2]/80 font-medium">Verified Blood Logistics & Medical Appointments</p>
          </div>
        </div>

      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl mx-auto">
          {/* Wireframe-Compliant Top Tab Switch: Admin & doctor login | Patient & user login with "Switch user" */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-full bg-white p-1.5 rounded-2xl border-2 border-[#1F2A6B]/20 shadow-sm flex items-center relative">
              <button
                type="button"
                onClick={() => handleTabSwitch('doctor')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'doctor'
                    ? 'bg-[#1F2A6B] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-sky-300" />
                <span>Admin & doctor login</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch('user')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'user'
                    ? 'bg-[#1F2A6B] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-red-500" />
                <span>Patient & user login</span>
              </button>
            </div>

            {/* Switch User indicator label matching wireframe */}
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#1F2A6B]">
              <ArrowLeftRight className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Switch user mode (Admin/Doctor vs Patient/User)</span>
            </div>
          </div>

          {/* D1 Centered Login Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
            {/* Top Card Accent */}
            <div className="bg-[#1F2A6B] px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-sky-200">
                  D1 – Very First Page UI
                </span>
                <h2 className="text-lg font-bold text-white">
                  Verified Doctor & Hospital Login
                </h2>
              </div>

              {/* Wireframe Top-Right Verification Badge Slot */}
              <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-1.5 rounded-xl shadow-xs text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Verified Facility</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-6 bg-[#E6E6F2]/60 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#1F2A6B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#1F2A6B]">Official Medical Center Access</p>
                  <p className="text-slate-600 mt-0.5">
                    Doctors and hospital staff sign in with their authenticated license details to review patient appointment requests (accept/cancel) and manage transfusion pipelines.
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
                {/* Facility Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Institution Credential Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Hospital', 'Verified Doctor', 'Blood Bank'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFacilityType(type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
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

                {/* Email / ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Officer Email / Hospital ID
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
                    Portal Security Password
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

                {/* Medical License ID & Facility Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      State Medical License #
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
                      Hospital Facility ID
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

              {/* Wireframe explanatory note */}
              <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-500">
                <p>
                  Normal user looking to request or donate blood?{' '}
                  <button
                    onClick={() => handleTabSwitch('user')}
                    className="font-bold text-red-600 hover:underline"
                  >
                    Switch to Patient & User Login (U1)
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        LifeDrop System · Certified Health & Blood Transfusion Protocol 2026
      </footer>
    </div>
  );
};
