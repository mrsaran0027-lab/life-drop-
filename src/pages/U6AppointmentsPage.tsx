import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  Stethoscope,
  Droplets,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Calendar,
  Send,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Activity,
} from 'lucide-react';
import { AppointmentService } from '../types';

export const U6AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, createAppointment, currentUser } = useApp();

  // Active modal or inline form state
  const [activeServiceModal, setActiveServiceModal] = useState<AppointmentService | null>(null);

  // Common form inputs
  const [patientName, setPatientName] = useState(currentUser.name || '');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [department, setDepartment] = useState('');

  // Filter user's appointments
  const userAppointments = appointments;

  const handleOpenBooking = (service: AppointmentService) => {
    setActiveServiceModal(service);
    if (service === 'doctor consultation') {
      setDepartment('Hematology Specialist Clinic');
      setNotes('');
    } else if (service === 'blood test') {
      setDepartment('Pathology & Cross-Match Lab');
      setNotes('');
    } else {
      setDepartment('Transfusion Registry Records');
      setNotes('');
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeServiceModal) return;

    createAppointment({
      patientName: patientName || currentUser.name || 'Patient',
      service: activeServiceModal,
      requestedDate: requestedDate || new Date().toISOString().split('T')[0],
      requestedTime,
      notes,
      department,
    });

    setActiveServiceModal(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-0.5 rounded-md">
              U6 – Clinical Appointments
            </span>
            <span className="text-xs text-slate-500">Connected to Hospital Doctor Queues</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Request Doctor Consultations, Tests & Reports
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Book medical services directly with verified hospitals. Hospital physicians review requests in their dashboard and confirm an exact clinical time slot.
          </p>
        </div>
      </div>

      {/* Main Split Layout matching Wireframe Page 6: Left 3 Cards, Right Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3 REQUEST CARDS (Page 6 Wireframe) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Available Medical Services</span>
            <span className="text-xs font-normal text-slate-500">Click to book</span>
          </h3>

          {/* Card 1: Doctor Consultation */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#1F2A6B]/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  Specialist Consultation
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Doctor Consultation</h4>
              <p className="text-xs text-slate-600 mt-1">
                One-on-one session with clinical hematologists and transfusion physicians regarding pre-donation health checks or post-operative blood requirements.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  St. Jude Outpatient Bay
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Avg. 25 mins
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Immediate hospital queue</span>
              <button
                type="button"
                onClick={() => handleOpenBooking('doctor consultation')}
                className="px-4 py-2 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Blood Test */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-red-400/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-red-600 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <Droplets className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  Diagnostic Lab
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Blood Test & Screening</h4>
              <p className="text-xs text-slate-600 mt-1">
                Complete Blood Count (CBC), ABO & Rh Cross-match, hemoglobin level evaluation, and infectious disease screening prior to transfusion or donation.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Clinical Pathology Lab
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Fast 4-hr turnaround
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Standard phlebotomy</span>
              <button
                type="button"
                onClick={() => handleOpenBooking('blood test')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-red-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Blood Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Report Request */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#1F2A6B]/50 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Medical Records
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">Official Report & History</h4>
              <p className="text-xs text-slate-600 mt-1">
                Retrieve certified donation certificate, antibody titer report, or hospital transfusion verification report signed by attending physician.
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Hospital Medical Records
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Digital copy
                </span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Certified documentation</span>
              <button
                type="button"
                onClick={() => handleOpenBooking('report')}
                className="px-4 py-2 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Request Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: APPOINTMENTS SUMMARY / STATUS PANEL (Page 6 Wireframe) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Submitted Appointments Status Panel
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-[#E6E6F2] text-[#1F2A6B] rounded-full">
              {userAppointments.length} Total
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="bg-[#E6E6F2]/50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#1F2A6B] shrink-0 mt-0.5" />
              <p>
                Requests booked here are transmitted instantly to hospital doctors in D2. When a doctor accepts, their confirmed clinic time slot appears right below with an emerald badge.
              </p>
            </div>

            {userAppointments.length === 0 ? (
              <div className="py-12 px-4 text-center text-slate-500 space-y-3">
                <CalendarClock className="w-12 h-12 mx-auto text-slate-300" />
                <h4 className="text-base font-bold text-slate-800">No Appointments Booked Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click on any of the medical service cards on the left to schedule a consultation, diagnostic blood test, or report.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {userAppointments.map((apt) => {
                  const isPending = apt.status === 'Pending';
                  const isAccepted = apt.status === 'Accepted';
                  const isCancelled = apt.status === 'Cancelled';

                  return (
                    <div
                      key={apt.id}
                      className={`p-4 rounded-2xl border-2 transition-all shadow-2xs ${
                        isAccepted
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isPending
                          ? 'border-amber-200 bg-amber-50/20'
                          : 'border-rose-200 bg-rose-50/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              apt.service === 'doctor consultation'
                                ? 'bg-sky-100 text-sky-700'
                                : apt.service === 'blood test'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {apt.service === 'doctor consultation' && <Stethoscope className="w-5 h-5" />}
                            {apt.service === 'blood test' && <Droplets className="w-5 h-5" />}
                            {apt.service === 'report' && <FileText className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-slate-900 capitalize">
                                {apt.service}
                              </h5>
                              <span className="text-[10px] font-mono text-slate-400">
                                #{apt.id.slice(-6)}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              Patient: {apt.patientName}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 font-medium text-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                {apt.requestedDate}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                Pref: {apt.requestedTime}
                              </span>
                            </div>

                            {apt.department && (
                              <p className="text-[11px] text-slate-500 mt-1">
                                Dept: {apt.department}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 text-right">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </span>
                          )}

                          {isAccepted && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                Accepted
                              </span>
                              {apt.acceptedTimeSlot && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Slot: {apt.acceptedTimeSlot}
                                </span>
                              )}
                            </div>
                          )}

                          {isCancelled && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              Cancelled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#1F2A6B] p-5 sm:p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  {activeServiceModal === 'doctor consultation' && <Stethoscope className="w-5 h-5 text-sky-300" />}
                  {activeServiceModal === 'blood test' && <Droplets className="w-5 h-5 text-rose-300" />}
                  {activeServiceModal === 'report' && <FileText className="w-5 h-5 text-purple-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white capitalize">
                    Book {activeServiceModal}
                  </h3>
                  <p className="text-xs text-[#E6E6F2]/80">
                    Transmitted to hospital doctor for schedule confirmation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveServiceModal(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requested Date
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time of Day
                  </label>
                  <select
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none bg-white"
                  >
                    <option value="09:00 AM - Morning">09:00 AM - Morning</option>
                    <option value="10:30 AM - Morning">10:30 AM - Morning</option>
                    <option value="02:00 PM - Afternoon">02:00 PM - Afternoon</option>
                    <option value="04:00 PM - Evening">04:00 PM - Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Facility Focus
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Hematology Specialist Clinic"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Notes / Symptoms / History (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need cross-match test before scheduled surgery on Friday..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#1F2A6B] focus:ring-2 focus:ring-[#1F2A6B]/20 outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveServiceModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
