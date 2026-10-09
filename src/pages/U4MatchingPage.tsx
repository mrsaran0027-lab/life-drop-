import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  Droplets,
  Clock,
  Navigation,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Truck,
  Hospital,
  Activity,
  ArrowRight,
  AlertCircle,
  Play,
  Check,
  RotateCcw,
} from 'lucide-react';
import { MatchStep } from '../types';

export const U4MatchingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeMatch, updateMatchStep, currentUser } = useApp();

  // Tab: patient & donor req (matches wireframe Page 5)
  const [activeTab, setActiveTab] = useState<'patient_donor_req' | 'transfusion_log'>('patient_donor_req');
  const [etaCountdown, setEtaCountdown] = useState<number>(activeMatch?.estimatedArrivalMins || 15);

  // Simulated ETA countdown tick
  useEffect(() => {
    if (!activeMatch) return;
    const interval = setInterval(() => {
      setEtaCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000);
    return () => clearInterval(interval);
  }, [activeMatch]);

  const steps: { step: MatchStep; label: string; description: string; icon: any }[] = [
    {
      step: 1,
      label: 'Request Confirmed',
      description: 'Blood group verification & compatibility locked',
      icon: ShieldCheck,
    },
    {
      step: 2,
      label: 'Donor En Route',
      description: 'Volunteer donor mobilized towards emergency hospital',
      icon: Truck,
    },
    {
      step: 3,
      label: 'Arrived at Hospital',
      description: 'Check-in at Blood Bank reception / Triage Bay',
      icon: Hospital,
    },
    {
      step: 4,
      label: 'Transfusion Active',
      description: 'Phlebotomy / PRBC administration in progress',
      icon: Activity,
    },
    {
      step: 5,
      label: 'Safe & Complete',
      description: 'Units verified, patient stabilized, records archived',
      icon: CheckCircle2,
    },
  ];

  if (!activeMatch) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E6E6F2] text-[#1F2A6B] flex items-center justify-center mx-auto shadow-inner">
          <HeartHandshake className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">No Active Match in Progress</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          The Matching page activates automatically when a donor accepts an emergency patient request of a compatible blood group.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/patient-view')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Find Donors as Patient (U3.1)
          </button>
          <button
            onClick={() => navigate('/donor-view')}
            className="px-5 py-2.5 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Review Patient Requests as Donor (U3.2)
          </button>
        </div>
      </div>
    );
  }

  const currentStepNum = activeMatch.currentStep;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title & Tab (Page 5 Wireframe: "Tab: patient & donor req") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              U4 – Matching Page
            </span>
            <span className="text-xs text-slate-500">Live Transfusion Logistics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Matching Status (Same Blood Group Verified)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Confirmed match between volunteer donor and recipient. Real-time ETA and step progress.
          </p>
        </div>

        {/* Wireframe Top Tab */}
        <div className="inline-flex p-1 bg-[#E6E6F2] rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('patient_donor_req')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'patient_donor_req'
                ? 'bg-[#1F2A6B] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Tab: Patient & Donor Req
          </button>
          <button
            onClick={() => setActiveTab('transfusion_log')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'transfusion_log'
                ? 'bg-[#1F2A6B] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Clinical Safety Log
          </button>
        </div>
      </div>

      {/* Main Matched Cards Grid (Page 5 Wireframe: "Donor Found" / "Patient Matched") */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: PATIENT MATCHED */}
        <div className="bg-white rounded-3xl border-2 border-red-200 p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
              Recipient Profile
            </span>
            <span className="text-xs font-semibold text-slate-400 font-mono">
              Match #{activeMatch.id}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            Patient Matched
          </h3>
          <p className="text-xs text-slate-500 mb-4">Verified recipient receiving blood units</p>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Patient Name:</span>
              <span className="font-bold text-slate-900 text-sm">{activeMatch.patientName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Blood Group Required:</span>
              <span className="font-mono font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded text-sm">
                {activeMatch.bloodGroup}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Units Demanded:</span>
              <span className="font-semibold text-slate-800">{activeMatch.units} Units (PRBC)</span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Hospital Facility:</span>
              <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                {activeMatch.hospital}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Contact Desk:</span>
              <span className="font-mono text-slate-700">{activeMatch.patientPhone}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: DONOR FOUND */}
        <div className="bg-white rounded-3xl border-2 border-[#1F2A6B]/30 p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-1 rounded-md border border-slate-300">
              Volunteer Hero
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Screened & Ready
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            Donor Found
          </h3>
          <p className="text-xs text-slate-500 mb-4">Accepted voluntary emergency donation</p>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Donor Name:</span>
              <span className="font-bold text-slate-900 text-sm">{activeMatch.donorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Donor Blood Group:</span>
              <span className="font-mono font-bold text-[#1F2A6B] bg-blue-100 px-2 py-0.5 rounded text-sm">
                {activeMatch.bloodGroup}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transit Vehicle:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[210px]">
                {activeMatch.vehicleInfo || 'Private Vehicle · Direct Dispatch'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Estimated Arrival Time:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{etaCountdown} mins
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Direct Phone:</span>
              <span className="font-mono text-slate-700">{activeMatch.donorPhone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Card (Showing Coming Time, Receiving Status, Arrival Status) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Live Logistics & Transfusion Tracker
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Current receiving status: <strong className="text-[#1F2A6B]">{activeMatch.receivingStatus}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Simulate Dispatch Flow:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => updateMatchStep(s as MatchStep)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentStepNum === s
                      ? 'bg-[#1F2A6B] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                  title={`Step ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Arrival Status Progress Stepper (Wireframe Page 5) */}
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {steps.map((st) => {
              const Icon = st.icon;
              const isPassed = currentStepNum >= st.step;
              const isCurrent = currentStepNum === st.step;

              return (
                <div
                  key={st.step}
                  onClick={() => updateMatchStep(st.step)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                    isCurrent
                      ? 'bg-[#1F2A6B] text-white border-[#1F2A6B] shadow-md ring-4 ring-[#1F2A6B]/15'
                      : isPassed
                      ? 'bg-emerald-50 text-slate-900 border-emerald-300'
                      : 'bg-white text-slate-400 border-slate-200 opacity-70'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-xs ${
                      isCurrent
                        ? 'bg-white text-[#1F2A6B]'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold block leading-tight">{st.label}</span>
                  <p
                    className={`text-[10px] mt-1 leading-snug line-clamp-2 ${
                      isCurrent ? 'text-[#E6E6F2]/80' : 'text-slate-500'
                    }`}
                  >
                    {st.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>
              Arrival status: <strong>{activeMatch.arrivalStatus}</strong> · Receiving:{' '}
              <strong>{activeMatch.receivingStatus}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStepNum < 5 && (
              <button
                onClick={() => updateMatchStep((currentStepNum + 1) as MatchStep)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>Advance Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
