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
} from 'lucide-react';
import { AppointmentService } from '../types';

export const U6AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, createAppointment, currentUser, switchUserRole } = useApp();

  // Active modal or inline form state
  const [activeServiceModal, setActiveServiceModal] = useState<AppointmentService | null>(null);

  // Common form inputs
  const [patientName, setPatientName] = useState(currentUser.name || '');
  const [requestedDate, setRequestedDate] = useState('');
  const [requestedTime, setRequestedTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [department, setDepartment] = useState('');

  // Filter user's appointments (or all submitted)
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
      patientName,
      service: activeServiceModal,
      requestedDate,
      requestedTime,
      notes,
      department,
      doctorName: 'Dr. Arthur Vance, MD',
    });

    setActiveServiceModal(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F2A6B] bg-[#E6E6F2] px-2.5 py-0.5 rounded-md">
              U6 – Medical Appointments
            </span>
            <span className="text-xs text-slate-500">Live Dual-Sync with Doctor Dashboard (D2)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Request Doctor Consultation, Blood Test & Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Book hospital services directly. Once submitted, hospital physicians review in D2 and confirm an exact clinical time slot.
          </p>
        </div>

        {/* Quick Jump to Doctor Dashboard to test bidirectional sync */}
        <button
          onClick={() => {
            switchUserRole('doctor');
            navigate('/doctor');
          }}
          className="px-4 py-2 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        >
          <Stethoscope className="w-4 h-4 text-sky-300" />
          <span>Test D2 Doctor Review View</span>
        </button>
      </div>

      {/* Main Split Layout matching Wireframe Page 6: Left 3 Cards, Right Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3 REQUEST CARDS (Page 6 Wireframe) */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Available Clinical Services
          </h3>

          {/* CARD 1: DOCTOR CONSULTATION */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#1F2A6B]/50 p-5 shadow-xs transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1F2A6B] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Stethoscope className="w-6 h-6 text-sky-300" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    1. Doctor Consultation
                  </h4>
                  <span className="text-[10px] font-bold text-[#1F2A6B] bg-[#E6E6F2] px-2 py-0.5 rounded">
                    Physician
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct one-on-one consultation with specialized hematologists and transfusion specialists. Complete donor health checkups, anemia guidance, and pre-surgery clearance.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenBooking('doctor consultation')}
                    className="px-4 py-2 bg-[#1F2A6B] hover:bg-[#161e4e] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Request Doctor Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: BLOOD TEST */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-red-500/50 p-5 shadow-xs transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Droplets className="w-6 h-6 fill-white text-white" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    2. Blood Diagnostic Test
                  </h4>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                    Lab Screening
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hospital-certified laboratory testing: Complete Blood Count (CBC), Rh factor phenotype matching, viral marker safety profiles, hemoglobin and ferritin levels.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenBooking('blood test')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Book Blood Test</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: REPORT REQUEST */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-500/50 p-5 shadow-xs transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-6 h-6 text-indigo-100" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    3. Medical Report Request
                  </h4>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Records
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Obtain official certified donor documentation, verified blood group identity cards, transfusion logs, or antibodies compatibility transcripts for hospital submission.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenBooking('report')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Request Medical Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY / STATUS PANEL (Page 6 Wireframe) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Submitted Appointments
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time status updates synced with hospital doctors
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {userAppointments.length} Total
            </span>
          </div>

          {/* Status List */}
          <div className="space-y-3">
            {userAppointments.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CalendarClock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No appointments requested yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Use the cards on the left to schedule your first visit.
                </p>
              </div>
            ) : (
              userAppointments.map((apt) => {
                const isAccepted = apt.status === 'Accepted';
                const isCancelled = apt.status === 'Cancelled';
                const isPending = apt.status === 'Pending';

                return (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isAccepted
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : isCancelled
                        ? 'border-rose-200 bg-rose-50/20'
                        : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 capitalize">
                            {apt.service}
                          </h4>
                          <span className="text-xs text-slate-400 font-mono">#{apt.id}</span>
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested for: <strong>{apt.requestedDate}</strong> ({apt.requestedTime})
                        </p>

                        <div className="mt-2 text-xs text-slate-600 bg-white/80 p-2 rounded-lg border border-slate-200">
                          <p className="font-medium text-slate-700">Department: {apt.department}</p>
                          {apt.notes && <p className="text-slate-500 text-[11px] mt-0.5">"{apt.notes}"</p>}
                        </div>

                        {/* Confirmed Slot Banner */}
                        {isAccepted && apt.acceptedTimeSlot && (
                          <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>Confirmed Slot: {apt.acceptedTimeSlot}</span>
                          </div>
                        )}
                      </div>

                      {/* Status Badge (Pending / Accepted with time / Cancelled) */}
                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isCancelled
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          }`}
                        >
                          {isAccepted && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                          {isCancelled && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {isPending && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#1F2A6B] p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                  Appointment Request Form
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5 capitalize">
                  {activeServiceModal}
                </h3>
              </div>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Time Window
                  </label>
                  <select
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs bg-white"
                  >
                    <option value="09:00 AM">09:00 AM - Morning</option>
                    <option value="10:30 AM">10:30 AM - Morning</option>
                    <option value="01:30 PM">01:30 PM - Afternoon</option>
                    <option value="03:00 PM">03:00 PM - Afternoon</option>
                    <option value="05:00 PM">05:00 PM - Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department / Clinic Room
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Clinical Symptoms / Reasons
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#1F2A6B] outline-none text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveServiceModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1F2A6B] hover:bg-[#151c4a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Doctor Queue</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
