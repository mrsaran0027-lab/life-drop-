import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Heart,
  Navigation,
  MapPin,
  Building2,
  Check,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Phone,
  Plus,
} from 'lucide-react';
import { BloodGroup, isBloodCompatible } from '../types';

export const U32DonorView: React.FC = () => {
  const navigate = useNavigate();
  const { patientRequests, acceptPatientAsDonor, currentUser } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<'All' | 'Emergency' | 'Urgent' | 'Standard'>('All');

  // Active donor blood group
  const activeDonorBloodGroup: BloodGroup = currentUser.bloodGroup || 'O-';

  // Filter patient requests
  const filteredRequests = useMemo(() => {
    return patientRequests.filter((req) => {
      if (req.status === 'Matched' || req.status === 'Fulfilled') return false;
      if (urgencyFilter === 'All') return true;
      return req.urgency === urgencyFilter;
    });
  }, [patientRequests, urgencyFilter]);

  const handleAcceptRequest = (requestId: string) => {
    const res = acceptPatientAsDonor(requestId);
    if (res.success) {
      navigate('/matching');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-0.5 rounded-md">
              U3 (3.2) – Donor View
            </span>
            <span className="text-xs text-slate-500">Incoming Hospital & Trauma Requests</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Shows Patient Info for Donor
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Patients needing blood in nearby hospitals. Review compatibility and click <strong>Accept</strong> to initiate emergency transport and matching.
          </p>
        </div>

        {/* Donor Credential Card */}
        <div className="flex items-center gap-3 bg-red-50 p-3 rounded-2xl border border-red-200 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            {activeDonorBloodGroup}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-red-700 block">
              Active Donor Identity
            </span>
            <span className="text-xs font-bold text-slate-900">
              {currentUser.name || 'Volunteer Donor'} ({activeDonorBloodGroup})
            </span>
          </div>
        </div>
      </div>

      {/* Urgency Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter by Urgency:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {(['All', 'Emergency', 'Urgent', 'Standard'] as const).map((urg) => (
            <button
              key={urg}
              onClick={() => setUrgencyFilter(urg)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                urgencyFilter === urg
                  ? 'bg-[#1F2A6B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {urg}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Requests List (Without Map) */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500 space-y-3">
            <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Patient Blood Requests Pending</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {patientRequests.length === 0
                ? 'When patients create requests using the Patient Request form from User Home (U2), their requests will appear here for donors to accept.'
                : `No open requests under "${urgencyFilter}" filter.`}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Go to User Home (U2) to Create Patient Request</span>
              </button>
            </div>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isSelected = req.id === selectedPatientId;
            const isCompatible = isBloodCompatible(activeDonorBloodGroup, req.bloodGroup);
            const isEmergency = req.urgency === 'Emergency';

            return (
              <div
                key={req.id}
                onClick={() => setSelectedPatientId(req.id)}
                className={`bg-white rounded-2xl border-2 p-5 transition-all shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-600/20 bg-rose-50/20'
                    : isEmergency
                    ? 'border-red-200 hover:border-red-400'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Blood Requirement Badge */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 shadow-sm ${
                        isEmergency
                          ? 'bg-gradient-to-tr from-red-600 to-rose-700'
                          : 'bg-gradient-to-tr from-[#1F2A6B] to-[#2E3C8E]'
                      }`}
                    >
                      <span className="text-base font-mono leading-none">{req.bloodGroup}</span>
                      <span className="text-[10px] font-sans font-medium opacity-85 mt-0.5">
                        {req.units} {req.units === 1 ? 'Unit' : 'Units'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base text-slate-900">{req.patientName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isEmergency
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {req.urgency}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">#{req.id}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {req.hospital}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {req.location}
                        </span>
                      </div>

                      {req.notes && (
                        <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          "{req.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Accept Button */}
                  <div className="shrink-0 flex flex-col sm:items-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptRequest(req.id);
                      }}
                      disabled={!isCompatible}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                        isCompatible
                          ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/25'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept & Match</span>
                    </button>

                    {isCompatible ? (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        ✓ Compatible with donor {activeDonorBloodGroup}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-600">
                        ✗ Incompatible blood group
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
