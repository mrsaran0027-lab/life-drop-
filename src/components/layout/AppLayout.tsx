import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Droplets,
  HeartHandshake,
  Users,
  CalendarClock,
  ShieldCheck,
  Stethoscope,
  LogOut,
  ArrowLeftRight,
  Menu,
  X,
  Bell,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout: React.FC = () => {
  const { currentUser, switchUserRole, activeMatch, appointments } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDoctor = currentUser.role === 'doctor';
  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'Pending').length;

  const handleRoleToggle = () => {
    if (isDoctor) {
      switchUserRole('user');
      navigate('/home');
    } else {
      switchUserRole('doctor');
      navigate('/doctor');
    }
  };

  // User nav items (U2 - U6 + Flowchart)
  const userNavLinks = [
    { to: '/home', label: 'Home (U2)', icon: Home, end: true },
    { to: '/patient-view', label: 'Patient View (U3.1)', icon: Droplets },
    { to: '/donor-view', label: 'Donor View (U3.2)', icon: HeartPulse },
    {
      to: '/matching',
      label: 'Matching (U4)',
      icon: HeartHandshake,
      badge: activeMatch ? 'Active' : undefined,
      badgeColor: 'bg-red-600',
    },
    { to: '/groups', label: 'Groups (U5)', icon: Users },
    {
      to: '/appointments',
      label: 'Appointments (U6)',
      icon: CalendarClock,
      badge: pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount}` : undefined,
    },
  ];

  // Doctor nav items (D2 + appointments review)
  const doctorNavLinks = [
    {
      to: '/doctor',
      label: 'Doctor Dashboard (D2)',
      icon: Home,
      end: true,
      badge: pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount} req` : undefined,
      badgeColor: 'bg-red-500',
    },
    { to: '/appointments', label: 'All Appointments Queue', icon: CalendarClock },
  ];

  const currentNavLinks = isDoctor ? doctorNavLinks : userNavLinks;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FC] text-slate-800">
      <ToastContainer />

      {/* Desktop Left Icon Sidebar (Deep Navy #1F2A6B) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-[#1F2A6B] text-white shrink-0 shadow-xl transition-all duration-300 z-30">
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-4 lg:px-5 border-b border-white/10">
          <NavLink
            to={isDoctor ? '/doctor' : '/home'}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/40 text-white shrink-0 group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 fill-white text-white" />
            </div>
            <div className="hidden lg:block leading-tight">
              <span className="font-extrabold text-lg tracking-tight text-white block">LifeDrop</span>
              <span className="text-[11px] text-[#E6E6F2]/70 font-medium">Blood & Care Portal</span>
            </div>
          </NavLink>
        </div>

        {/* User Role Badge / Switcher in Sidebar */}
        <div className="p-3 lg:px-4 lg:py-3 border-b border-white/10 bg-black/15">
          <div className="hidden lg:flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6E6F2]/60">Active Role</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              {isDoctor ? <Stethoscope className="w-4 h-4 text-sky-300" /> : <Activity className="w-4 h-4 text-red-400" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-[#E6E6F2]/70 truncate">
                {isDoctor ? currentUser.hospitalName || 'Medical Center' : `Group: ${currentUser.bloodGroup || 'User'}`}
              </p>
            </div>
          </div>

          {/* Quick Role Switcher Button */}
          <button
            onClick={handleRoleToggle}
            className="w-full py-1.5 px-2 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors border border-white/15 shadow-sm"
            title="Switch User Role"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden lg:inline">
              Switch to {isDoctor ? 'Patient/User' : 'Doctor/Hospital'}
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1.5 overflow-y-auto">
          {currentNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive: active }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-xs lg:text-sm transition-all relative group ${
                    active
                      ? 'bg-[#E6E6F2] text-[#1F2A6B] shadow-md font-semibold'
                      : 'text-[#E6E6F2]/80 hover:bg-white/10 hover:text-white'
                  }`
                }
                title={item.label}
              >
                {({ isActive: active }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform ${
                        active ? 'text-[#1F2A6B] scale-110' : 'text-[#E6E6F2]/80 group-hover:text-white'
                      }`}
                    />
                    <span className="hidden lg:inline truncate">{item.label}</span>

                    {/* Badge */}
                    {item.badge && (
                      <span
                        className={`hidden lg:inline-flex ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badgeColor
                            ? `${item.badgeColor} text-white`
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Small dot for collapsed view */}
                    {item.badge && (
                      <span className="lg:hidden absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout & Switch */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[#E6E6F2]/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Back to Landing Page (D1)"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden lg:inline">Landing / D1 Login</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Droplets className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="font-extrabold text-base text-[#1F2A6B]">LifeDrop</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {isDoctor ? 'Medical Administration Portal' : 'Patient & Donor Community'}
              </span>
              <span>·</span>
              <span className="text-[#1F2A6B] font-medium">{currentUser.city || 'Metro City Area'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Switch Role Pill in Header */}
            <button
              onClick={handleRoleToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E6E6F2] hover:bg-[#d8d8ea] text-[#1F2A6B] transition-colors border border-slate-300/50 shadow-2xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">
                Role: <span className="font-bold underline">{isDoctor ? 'Doctor / Hospital' : 'User (Patient/Donor)'}</span>
              </span>
              <span className="sm:hidden">{isDoctor ? 'Doc' : 'User'}</span>
            </button>

            {/* User profile avatar badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                  isDoctor ? 'bg-[#1F2A6B]' : 'bg-red-600'
                }`}
              >
                {isDoctor ? 'MD' : currentUser.bloodGroup || 'U'}
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <span className="font-semibold text-slate-800 block truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {isDoctor ? 'License MD' : `Blood: ${currentUser.bloodGroup || 'N/A'}`}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Deep Navy #1F2A6B) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1F2A6B] text-white border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {currentNavLinks.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive: active }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative ${
                  active ? 'text-white font-bold' : 'text-[#E6E6F2]/70 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
