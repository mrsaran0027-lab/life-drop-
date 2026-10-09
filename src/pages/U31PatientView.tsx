import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Heart,
  Navigation,
  MapPin,
  ShieldCheck,
  Send,
  CheckCircle,
  Filter,
  AlertTriangle,
  Clock,
  ArrowRight,
  Phone,
  Calendar,
  UserPlus,
} from 'lucide-react';
import { BloodGroup, isBloodCompatible } from '../types';

export const U31PatientView: React.FC = () => {
  const navigate = useNavigate();
  const { donors, requestDonorForPatient, currentUser } = useApp();

  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const [selectedBloodFilter, setSelectedBloodFilter] = useState<'All' | BloodGroup>('All');

  // Active patient blood requirement (from current user or default O-)
  const patientBloodNeeded: BloodGroup = currentUser.bloodGroup || 'O-';

  // Sort donors by nearest location (distanceKm ascending)
  const sortedDonors = useMemo(() => {
    return [...donors].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [donors]);

  // Filtered donors
  const filteredDonors = useMemo(() => {
    return sortedDonors.filter((donor) => {
      if (selectedBloodFilter === 'All') return true;
      return donor.bloodGroup === selectedBloodFilter;
    });
  }, [sortedDonors, selectedBloodFilter]);

  const handleSendRequest = (donorId: string) => {
    requestDonorForPatient(donorId);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-md">
              U3 (3.1) – Patient View
            </span>
            <span className="text-xs text-slate-500">Sorted by Nearest Geographic Proximity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Shows Donor Info for Patient
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Locate volunteer blood donors nearest to your hospital. Click <strong>Request</strong> to dispatch an emergency notification.
          </p>
        </div>

        {/* Patient Target Blood Badge */}
        <div className="flex items-center gap-3 bg-[#E6E6F2]/70 p-3 rounded-2xl border border-slate-200/80 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            {patientBloodNeeded}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
              Patient Blood Target
            </span>
            <span className="text-xs font-bold text-[#1F2A6B]">
              Showing Compatible Donors
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter Blood Group:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          {(['All', 'O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const).map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBloodFilter(bg)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                selectedBloodFilter === bg
                  ? 'bg-[#1F2A6B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Available Donors List (Without Map) */}
      <div className="space-y-3">
        {filteredDonors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-500 space-y-3">
            <Droplets className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Volunteer Donors Registered Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {donors.length === 0
                ? 'When willing donors submit the Donor Availability form from User Home (U2), their profile and nearest distance will appear here.'
                : `No donors found matching the blood group filter "${selectedBloodFilter}".`}
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Go to User Home (U2) to Register a Donor</span>
              </button>
            </div>
          </div>
        ) : (
          filteredDonors.map((donor) => {
            const isSelected = donor.id === selectedDonorId;
            const isCompatible = isBloodCompatible(donor.bloodGroup, patientBloodNeeded);
            const isExact = donor.bloodGroup === patientBloodNeeded;
            const isUniversal = donor.bloodGroup === 'O-';
            const isRequested = donor.status === 'Requested';

            return (
              <div
                key={donor.id}
                onClick={() => setSelectedDonorId(donor.id)}
                className={`bg-white rounded-2xl border-2 p-5 transition-all shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#1F2A6B] ring-2 ring-[#1F2A6B]/20 bg-slate-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Blood Group Badge */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0 shadow-sm ${
                        isExact
                          ? 'bg-gradient-to-tr from-red-600 to-rose-600'
                          : isCompatible
                          ? 'bg-gradient-to-tr from-[#1F2A6B] to-[#2E3C8E]'
                          : 'bg-slate-400'
                      }`}
                    >
                      <span className="text-base font-mono leading-none">{donor.bloodGroup}</span>
                      <span className="text-[10px] font-sans font-medium opacity-85 mt-0.5">
                        {isExact ? 'Exact' : isUniversal ? 'Universal' : 'Donor'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-base text-slate-900">{donor.donorName}</h4>
                        {donor.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {donor.availability} Availability
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-red-600">
                          <Navigation className="w-3.5 h-3.5" />
                          {donor.distanceKm} km away
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {donor.location}
                        </span>
                        {donor.lastDonationDate && (
                          <>
                            <span>·</span>
                            <span>Last donated: {donor.lastDonationDate}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Request Button */}
                  <div className="shrink-0 flex flex-col sm:items-end gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendRequest(donor.id);
                      }}
                      disabled={isRequested}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                        isRequested
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                      }`}
                    >
                      {isRequested ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Request Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Request Blood</span>
                        </>
                      )}
                    </button>

                    {isCompatible ? (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        ✓ Compatible with recipient {patientBloodNeeded}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-600">
                        ⚠ Incompatible blood group
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
