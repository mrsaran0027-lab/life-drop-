import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Activity,
  AlertCircle,
  Building2,
  Stethoscope,
  Filter,
  Check,
  X,
  ShieldCheck,
  Droplets,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';

export const D2DoctorDashboard: React.FC = () => {
  const { currentUser, appointments, updateAppointmentStatus, switchUserRole } = useApp();

  // Selected filter
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [selectedAppointmentForAccept, setSelectedAppointmentForAccept] = useState<Appointment | null>(null);
  const [chosenTimeSlot, setChosenTimeSlot] = useState('10:30 AM');
  const [customSlot, setCustomSlot] = useState('');

  // Pre-configured clinic slots for fast selection
  const standardTimeSlots = [
    '09:00 AM - Morning Slot',
    '10:30 AM - Morning Slot',
    '11:45 AM - Pre-Noon Slot',
    '02:00 PM - Afternoon Slot',
    '03:30 PM - Afternoon Slot',
    '05:00 PM - Evening Slot',
  ];

  const isDoctor = currentUser.role === 'doctor';

  const handleOpenAcceptModal = (apt: Appointment) => {
    setSelectedAppointmentForAccept(apt);
    setChosenTimeSlot('10:30 AM - Morning Slot');
    setCustomSlot('');
  };

  const handleConfirmAccept = () => {
    if (!selectedAppointmentForAccept) return;
    const finalSlot = customSlot.trim() ? customSlot.trim() : chosenTimeSlot;
    updateAppointmentStatus(selectedAppointmentForAccept.id, 'Accepted', finalSlot);
    setSelectedAppointmentForAccept(null);
  };

  const handleCancelAppointment = (id: string) => {
    updateAppointmentStatus(id, 'Cancelled');
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === 'All') return true;
    return apt.status === statusFilter;
  });

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const acceptedCount = appointments.filter((a) => a.status === 'Accepted').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  return (
    <div className="space-y-6">
      {/* Role Verification Banner (if user navigated while not doctor) */}
      {!isDoctor && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">Doctor Access Verification Notice</p>
              <p className="text-xs text-amber-700">
                You are currently previewing as regular user ({currentUser.name}). Switch to Verified Doctor to test D2 workflow.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchUserRole('doctor')}
            className="px-4 py-2 bg-[#1F2A6B] text-white rounded-xl text-xs font-bold hover:bg-[#151c4a] transition-all shrink-0 cursor-pointer"
          >
            Switch to Doctor Account
          </button>
        </div>
      )}

      {/* D2 Header Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1F2A6B] text-white flex items-center justify-center shadow-md">
              <Stethoscope className="w-7 h-7 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-0.5 rounded-md">
                  D2 – Doctor Dashboard
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Hospital Desk
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {currentUser.name}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.hospitalName || 'Verified Clinical Hospital Desk'}</span>
                <span>·</span>
                <span>Transfusion & Consultation Schedule</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-6">
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Pending Review</span>
              <p className="text-2xl font-black text-amber-600 font-mono mt-0.5">{pendingCount}</p>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Accepted</span>
              <p className="text-2xl font-black text-emerald-600 font-mono mt-0.5">{acceptedCount}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Total</span>
              <p className="text-2xl font-black text-slate-800 font-mono mt-0.5">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Appointment Requests Table (Matches Page 2 Wireframe) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar & Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Users Request for Appointment
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review incoming patient bookings from U6. Accept by available time slot or cancel.
            </p>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1.5 bg-[#E6E6F2]/70 p-1 rounded-xl">
            {(['All', 'Pending', 'Accepted', 'Cancelled'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === filter
                    ? 'bg-[#1F2A6B] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <CalendarClock className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No appointments found matching this filter</p>
            <p className="text-xs text-slate-400 mt-1">
              New submissions from U6 (Appointments page) will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((apt) => {
              const isPending = apt.status === 'Pending';
              const isAccepted = apt.status === 'Accepted';
              const isCancelled = apt.status === 'Cancelled';

              return (
                <div
                  key={apt.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Patient info & Service */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                        apt.service === 'doctor consultation'
                          ? 'bg-[#1F2A6B] text-white'
                          : apt.service === 'blood test'
                          ? 'bg-red-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {apt.patientName.charAt(0)}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900">{apt.patientName}</h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize border border-slate-200">
                          {apt.service}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {apt.id}</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Requested: {apt.requestedDate} ({apt.requestedTime})
                        </span>
                        <span>·</span>
                        <span className="text-slate-600 truncate max-w-sm">
                          Notes: {apt.notes || 'Routine checkup request'}
                        </span>
                      </div>

                      {/* Display assigned slot if accepted */}
                      {isAccepted && apt.acceptedTimeSlot && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Assigned Time: {apt.acceptedTimeSlot}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Doctor Action Buttons (Accept / Cancel) */}
                  <div className="flex items-center gap-2 sm:justify-end shrink-0">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleOpenAcceptModal(apt)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept & Pick Time</span>
                        </button>

                        <button
                          onClick={() => handleCancelAppointment(apt.id)}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        {isAccepted ? 'Action completed' : 'Marked cancelled'}
                      </div>
                    )}

                    {/* Right-Side Column: Status Badge per Request (Matches Wireframe Page 2) */}
                    <div className="pl-3 sm:border-l border-slate-200 min-w-[110px] text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          isAccepted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isCancelled
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                        }`}
                      >
                        {isAccepted && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {isCancelled && <XCircle className="w-3 h-3 text-rose-600" />}
                        {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                        {apt.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accept Time Slot Modal (Pick available time) */}
      {selectedAppointmentForAccept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#1F2A6B] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                  Doctor Scheduling
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Confirm Time Slot for {selectedAppointmentForAccept.patientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointmentForAccept(null)}
                className="text-white/70 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-[#E6E6F2]/50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                <p>
                  <strong>Service:</strong> {selectedAppointmentForAccept.service}
                </p>
                <p>
                  <strong>Patient Requested Date:</strong> {selectedAppointmentForAccept.requestedDate}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                  Choose Available Clinical Slot:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {standardTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setChosenTimeSlot(slot);
                        setCustomSlot('');
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        chosenTimeSlot === slot && !customSlot
                          ? 'bg-[#1F2A6B] text-white border-[#1F2A6B] shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Specify Custom Time & Room (e.g., 03:15 PM - Room 402):
                </label>
                <input
                  type="text"
                  value={customSlot}
                  onChange={(e) => setCustomSlot(e.target.value)}
                  placeholder="e.g. 04:15 PM - Oncology Wing"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedAppointmentForAccept(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAccept}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
