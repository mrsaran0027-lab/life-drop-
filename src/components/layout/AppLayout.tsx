import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
  Activity,
  HeartPulse,
} from 'lucide-react';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout: React.FC = () => {
  const { currentUser, isAuthenticated, isDoctor, isUser, activeMatch, appointments, logout, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Strict Authentication Guard
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Strict Role Isolation Guard (Requirement #7: No switching between Doctor & User portals)
  // If doctor tries to access user pages, keep them in Doctor Dashboard
  if (isDoctor && location.pathname !== '/doctor') {
    addToast('Access Restricted', 'Doctor accounts cannot access Community/Patient portal. Log out to change roles.', 'error');
    return <Navigate to="/doctor" replace />;
  }

  // If user tries to access doctor dashboard, keep them in User Home
  if (isUser && location.pathname === '/doctor') {
    addToast('Access Restricted', 'User accounts cannot access Doctor/Hospital portal. Log out to change roles.', 'error');
    return <Navigate to="/home" replace />;
  }

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'Pending').length;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // User nav items (U2 - U6) - Strictly for User role
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

  // Doctor nav items (D2 only) - Strictly for Doctor role
  const doctorNavLinks = [
    {
      to: '/doctor',
      label: 'Doctor Dashboard (D2)',
      icon: Stethoscope,
      end: true,
      badge: pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount} req` : undefined,
      badgeColor: 'bg-red-500',
    },
  ];

  const currentNavLinks = isDoctor ? doctorNavLinks : userNavLinks;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FC] text-slate-800">
      <ToastContainer />

      {/* Desktop Left Icon Sidebar (Deep Navy #1F2A6B) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-[#1F2A6B] text-white shrink-0 shadow-xl transition-all duration-300 z-30">
        {/* Brand Header */}
        <div className="h-18 flex items-center justify-between px-4 lg:px-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-900/40 text-white shrink-0">
              <Droplets className="w-6 h-6 fill-white text-white" />
            </div>
            <div className="hidden lg:block leading-tight">
              <span className="font-extrabold text-lg tracking-tight text-white block">LifeDrop</span>
              <span className="text-[11px] text-[#E6E6F2]/70 font-medium">
                {isDoctor ? 'Doctor / Hospital' : 'Patient & Donor'}
              </span>
            </div>
          </div>
        </div>

        {/* User Identity Info in Sidebar */}
        <div className="p-3 lg:px-4 lg:py-3.5 border-b border-white/10 bg-black/15">
          <div className="hidden lg:flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6E6F2]/60">
              {isDoctor ? 'Verified Portal' : 'Community Member'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs ${
              isDoctor ? 'bg-sky-700' : 'bg-red-600'
            }`}>
              {isDoctor ? <Stethoscope className="w-4 h-4 text-sky-200" /> : currentUser.bloodGroup || 'U'}
            </div>
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentUser.name || (isDoctor ? 'Verified Doctor' : 'User')}</p>
              <p className="text-[11px] text-[#E6E6F2]/70 truncate">
                {isDoctor
                  ? currentUser.hospitalName || currentUser.licenseNumber || 'Medical Center'
                  : `Blood Group: ${currentUser.bloodGroup || 'General'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links (Strictly isolated by role) */}
        <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1.5 overflow-y-auto">
          {currentNavLinks.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive: active }) =>
                  `flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-xs lg:text-sm transition-all relative group cursor-pointer ${
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

        {/* Sidebar Footer with Logout Button */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:text-rose-100 transition-colors cursor-pointer border border-rose-500/20"
            title="Log Out of this role"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="hidden lg:inline">Sign Out ({isDoctor ? 'Doctor' : 'User'})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Droplets className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="font-extrabold text-base text-[#1F2A6B]">LifeDrop</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-slate-800">
                {isDoctor ? 'Medical Administration Portal' : 'Patient & Donor Community'}
              </span>
              <span>·</span>
              <span className="text-[#1F2A6B] font-semibold">
                {isDoctor ? currentUser.hospitalName || 'Verified Facility' : currentUser.city || 'Metro Area'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Identity Badge */}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
                  isDoctor ? 'bg-[#1F2A6B]' : 'bg-red-600'
                }`}
              >
                {isDoctor ? 'MD' : currentUser.bloodGroup || 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="font-semibold text-slate-800 block truncate max-w-[140px]">
                  {currentUser.name || (isDoctor ? 'Doctor Admin' : 'User')}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {isDoctor ? currentUser.licenseNumber || 'Verified License' : `Blood Group: ${currentUser.bloodGroup || 'General'}`}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Deep Navy #1F2A6B) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1F2A6B] text-white border-t border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {currentNavLinks.map((item) => {
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

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium text-rose-300 hover:text-white cursor-pointer"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          <span>Log Out</span>
        </button>
      </nav>
    </div>
  );
};
