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
  const { currentUser, appointments, updateAppointmentStatus } = useApp();

  // Selected filter
  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentStatus>('All');
  const [selectedAppointmentForAccept, setSelectedAppointmentForAccept] = useState<Appointment | null>(null);
  const [chosenTimeSlot, setChosenTimeSlot] = useState('10:30 AM - Morning Slot');
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
      {/* D2 Header Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1F2A6B] text-white flex items-center justify-center shadow-md">
              <Stethoscope className="w-7 h-7 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md">
                  D2 – Doctor Dashboard
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {currentUser.licenseNumber || 'Verified License'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Clinical Appointment Requests & Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Hospital facility: <strong className="text-[#1F2A6B]">{currentUser.hospitalName || 'St. Jude Medical Center'}</strong>. Review incoming patient requests, assign time slots, or cancel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-[#E6E6F2]/70 p-2.5 rounded-2xl border border-slate-200 shrink-0">
            <div className="px-3 py-1.5 bg-white rounded-xl text-center shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Pending</span>
              <span className="text-base font-extrabold text-amber-600">{pendingCount}</span>
            </div>
            <div className="px-3 py-1.5 bg-white rounded-xl text-center shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Accepted</span>
              <span className="text-base font-extrabold text-emerald-600">{acceptedCount}</span>
            </div>
            <div className="px-3 py-1.5 bg-white rounded-xl text-center shadow-2xs">
              <span className="text-xs text-slate-500 font-medium block">Total</span>
              <span className="text-base font-extrabold text-[#1F2A6B]">{appointments.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter Requests:</span>
        </div>

        <div className="flex items-center gap-1.5">
          {(['All', 'Pending', 'Accepted', 'Cancelled'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-[#1F2A6B] text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
              {filter === 'Pending' && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List of Appointment Requests (Matches Page 2 Wireframe) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-10 text-center text-slate-500 space-y-2">
            <CalendarClock className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Appointment Requests In Queue</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {appointments.length === 0
                ? 'When community users submit consultation or blood test requests from the Appointments page (U6), they appear here in real-time for doctor confirmation.'
                : `No appointment requests found matching filter: "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Patient & Service</th>
                  <th className="py-3.5 px-4">Requested Date & Time</th>
                  <th className="py-3.5 px-4">Clinical Department</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAppointments.map((apt) => {
                  const isPending = apt.status === 'Pending';
                  const isAccepted = apt.status === 'Accepted';
                  const isCancelled = apt.status === 'Cancelled';

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Patient & Service */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              apt.service === 'doctor consultation'
                                ? 'bg-sky-100 text-sky-700'
                                : apt.service === 'blood test'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {apt.service === 'doctor consultation' && <Stethoscope className="w-4 h-4" />}
                            {apt.service === 'blood test' && <Droplets className="w-4 h-4" />}
                            {apt.service === 'report' && <Activity className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">
                              {apt.patientName}
                            </span>
                            <span className="text-[11px] text-slate-500 capitalize font-medium">
                              {apt.service}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Requested Date & Time */}
                      <td className="py-4 px-4 font-medium text-slate-700">
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{apt.requestedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{apt.requestedTime}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-4 px-4">
                        <span className="text-xs text-slate-700 font-medium block">
                          {apt.department || 'Outpatient Clinic'}
                        </span>
                        {apt.notes && (
                          <span className="text-[11px] text-slate-500 line-clamp-1 italic">
                            "{apt.notes}"
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 text-center">
                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                        {isAccepted && (
                          <div className="inline-flex flex-col items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3 h-3" />
                              Accepted
                            </span>
                            {apt.acceptedTimeSlot && (
                              <span className="text-[10px] text-emerald-800 font-medium mt-0.5">
                                Slot: {apt.acceptedTimeSlot}
                              </span>
                            )}
                          </div>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Actions (Accept / Cancel) */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenAcceptModal(apt)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                              title="Accept & Choose Available Time Slot"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept</span>
                            </button>

                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg font-bold text-xs flex items-center gap-1 transition-all border border-slate-200 cursor-pointer"
                              title="Cancel Request"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 font-medium italic">
                              {isAccepted ? 'Confirmed in schedule' : 'Request dismissed'}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Time Slot Picker Modal (Wireframe: "Accept -> Choose available time slot") */}
      {selectedAppointmentForAccept && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#1F2A6B] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Choose Available Time Slot</h3>
                  <p className="text-xs text-[#E6E6F2]/80">
                    Patient: {selectedAppointmentForAccept.patientName} ({selectedAppointmentForAccept.service})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointmentForAccept(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Requested Date: <strong>{selectedAppointmentForAccept.requestedDate}</strong>. Select the clinic time slot to assign to this appointment:
              </p>

              {/* Standard Slots Grid */}
              <div className="grid grid-cols-2 gap-2">
                {standardTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setChosenTimeSlot(slot);
                      setCustomSlot('');
                    }}
                    className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                      chosenTimeSlot === slot && !customSlot
                        ? 'bg-[#1F2A6B] text-white border-[#1F2A6B] shadow-sm font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Or Custom Slot Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or Specify Custom Time Slot:
                </label>
                <input
                  type="text"
                  value={customSlot}
                  onChange={(e) => setCustomSlot(e.target.value)}
                  placeholder="e.g. 01:15 PM - Urgent Trauma Bay"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppointmentForAccept(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAccept}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Schedule</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
