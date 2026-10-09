import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Heart,
  HeartPulse,
  Activity,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  X,
  Plus,
} from 'lucide-react';
import { BloodGroup, UrgencyLevel } from '../types';

export const U2UserHome: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addPatientRequest, addDonorAvailability, setUserMode } = useApp();

  // Modals for Patient form & Donor form
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [donorModalOpen, setDonorModalOpen] = useState(false);

  // Patient Request Form State
  const [patientName, setPatientName] = useState(currentUser.name || '');
  const [patientBloodGroup, setPatientBloodGroup] = useState<BloodGroup>(currentUser.bloodGroup || 'O-');
  const [units, setUnits] = useState(1);
  const [hospital, setHospital] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Emergency');
  const [location, setLocation] = useState(currentUser.city || '');
  const [contactNumber, setContactNumber] = useState(currentUser.phone || '');
  const [patientNotes, setPatientNotes] = useState('');

  // Donor Availability Form State
  const [donorName, setDonorName] = useState(currentUser.name || '');
  const [donorBloodGroup, setDonorBloodGroup] = useState<BloodGroup>(currentUser.bloodGroup || 'O-');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [availability, setAvailability] = useState<'Immediate' | 'Today' | 'Within 24h'>('Immediate');
  const [donorLocation, setDonorLocation] = useState(currentUser.city || '');
  const [donorPhone, setDonorPhone] = useState(currentUser.phone || '');

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserMode('patient');
    addPatientRequest({
      patientName,
      bloodGroup: patientBloodGroup,
      units,
      hospital,
      urgency,
      location,
      city: currentUser.city || 'Downtown Metro',
      contactNumber,
      notes: patientNotes,
    });
    setPatientModalOpen(false);
    navigate('/patient-view');
  };

  const handleDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserMode('donor');
    addDonorAvailability({
      donorName,
      bloodGroup: donorBloodGroup,
      lastDonationDate,
      availability,
      location: donorLocation,
      city: currentUser.city || 'Downtown Metro',
      phone: donorPhone,
    });
    setDonorModalOpen(false);
    navigate('/donor-view');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-[#1F2A6B] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-40 -top-12 w-48 h-48 rounded-full bg-red-600/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-200 bg-white/10 px-2.5 py-0.5 rounded-md">
                U2 – User Home
              </span>
              <span className="text-xs text-white/80">Welcome, {currentUser.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Blood Transfusion & Donor Dispatch Hub
            </h2>
            <p className="text-xs sm:text-sm text-[#E6E6F2]/90 max-w-2xl leading-relaxed">
              Every drop can save a life. Select whether you are seeking urgent blood for a patient or declaring your availability as a willing volunteer donor.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-white shadow-md">
              {currentUser.bloodGroup || 'O-'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Registered Group</p>
              <p className="text-[11px] text-[#E6E6F2]/80">Universal Donor Safe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Large Cards Matching Wireframe Page 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: PATIENT REQUEST (Request for Blood) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-red-500/50 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 pointer-events-none transition-transform group-hover:scale-110" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 mb-6 group-hover:scale-105 transition-transform">
              <Droplets className="w-8 h-8 fill-white text-white" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md">
              Need Blood Urgent
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
              Patient Request
            </h3>
            <p className="text-sm font-semibold text-slate-500 mb-2">
              (Request for Blood)
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Create an emergency or standard patient blood request. Specify blood group, units, hospital facility, and urgency to search nearest available donors on the live map.
            </p>

            <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Auto-scans verified donors within 15 km radius</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span>Instant dispatch notifications sent to O- and compatible groups</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={() => setPatientModalOpen(true)}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:from-red-800 active:to-rose-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Fill Patient Request Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CARD 2: DONOR AVAILABILITY (Willing to Donate Person) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#1F2A6B]/50 p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6E6F2] rounded-bl-full -z-0 pointer-events-none transition-transform group-hover:scale-110" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#1F2A6B] text-white flex items-center justify-center shadow-lg shadow-[#1F2A6B]/30 mb-6 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-8 h-8 text-sky-200" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-1 rounded-md">
              Volunteer Lifesaver
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-3">
              Donor Availability
            </h3>
            <p className="text-sm font-semibold text-slate-500 mb-2">
              (Willing to Donate Person)
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Register yourself as ready to donate. View real incoming patient requests sorted by urgency and distance, accept a matched request, and monitor hospital arrival.
            </p>

            <div className="space-y-2 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified donor credentials with safety screening check</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1F2A6B]" />
                <span>Direct coordination with hospital trauma & transfusion units</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={() => setDonorModalOpen(true)}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-[#1F2A6B] to-[#2D3D94] hover:from-[#192358] hover:to-[#243177] active:from-[#141b44] active:to-[#1e275f] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#1F2A6B]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Donor Availability Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Ribbon for Groups (U5) & Appointments (U6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => navigate('/groups')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#1F2A6B]/40 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6E6F2] text-[#1F2A6B] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">U5: Blood Groups & Networks</h4>
              <p className="text-xs text-slate-500">Join verified blood donor circles or create new groups</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1F2A6B] transition-colors" />
        </div>

        <div
          onClick={() => navigate('/appointments')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-red-500/40 transition-all flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">U6: Clinical Appointments</h4>
              <p className="text-xs text-slate-500">Doctor consultation, blood tests, and lab reports</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
        </div>
      </div>

      {/* PATIENT REQUEST MODAL (as per wireframe) */}
      {patientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-red-600 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200">
                  Patient Form · Request Blood
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Emergency Blood Request</h3>
              </div>
              <button
                onClick={() => setPatientModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePatientSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group Required
                  </label>
                  <select
                    value={patientBloodGroup}
                    onChange={(e) => setPatientBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm bg-white font-mono font-bold"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Units Needed (Pints / PRBC)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital / Medical Center
                </label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm bg-white font-semibold"
                  >
                    <option value="Emergency">Emergency (Immediate)</option>
                    <option value="Urgent">Urgent (Within 6h)</option>
                    <option value="Standard">Standard (Within 24h)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location / Address for Dispatch
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-red-600 outline-none text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPatientModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-1.5"
                >
                  <Droplets className="w-4 h-4 fill-white" />
                  <span>Publish Request & View Donors (U3.1)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DONOR AVAILABILITY MODAL (as per wireframe) */}
      {donorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="bg-[#1F2A6B] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                  Donor Form · Willing to Donate
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">Register Donor Availability</h3>
              </div>
              <button
                onClick={() => setDonorModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDonorSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donor Full Name
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Blood Group
                  </label>
                  <select
                    value={donorBloodGroup}
                    onChange={(e) => setDonorBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-sm bg-white font-mono font-bold"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Donation Date
                  </label>
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Availability Window
                  </label>
                  <select
                    value={availability}
                    onChange={(e) =>
                      setAvailability(e.target.value as 'Immediate' | 'Today' | 'Within 24h')
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-sm bg-white font-semibold"
                  >
                    <option value="Immediate">Immediate (Within 1 hour)</option>
                    <option value="Today">Today (Flexible)</option>
                    <option value="Within 24h">Within 24 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone / Cell
                  </label>
                  <input
                    type="text"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Location / Neighborhood
                </label>
                <input
                  type="text"
                  value={donorLocation}
                  onChange={(e) => setDonorLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-sm"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDonorModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1F2A6B] hover:bg-[#151c4a] text-white shadow-md flex items-center gap-1.5"
                >
                  <HeartPulse className="w-4 h-4 text-sky-200" />
                  <span>Register & View Patient Requests (U3.2)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
