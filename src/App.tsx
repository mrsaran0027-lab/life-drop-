import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { D1LandingLogin } from './pages/D1LandingLogin';
import { D2DoctorDashboard } from './pages/D2DoctorDashboard';
import { U1UserAuth } from './pages/U1UserAuth';
import { U2UserHome } from './pages/U2UserHome';
import { U31PatientView } from './pages/U31PatientView';
import { U32DonorView } from './pages/U32DonorView';
import { U4MatchingPage } from './pages/U4MatchingPage';
import { U5GroupsPage } from './pages/U5GroupsPage';
import { U6AppointmentsPage } from './pages/U6AppointmentsPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* D1: Very First Page UI (Standalone) */}
          <Route path="/" element={<D1LandingLogin />} />

          {/* U1: User Login / Sign-up (Standalone) */}
          <Route path="/auth" element={<U1UserAuth />} />

          {/* App Layout for In-Portal Views (Sidebar + Top Bar + Responsive Bottom Bar) */}
          <Route element={<AppLayout />}>
            {/* D2: Doctor Dashboard */}
            <Route path="/doctor" element={<D2DoctorDashboard />} />

            {/* U2: User Home */}
            <Route path="/home" element={<U2UserHome />} />

            {/* U3.1: Patient View (Donors sorted by nearest) */}
            <Route path="/patient-view" element={<U31PatientView />} />

            {/* U3.2: Donor View (Patient requests) */}
            <Route path="/donor-view" element={<U32DonorView />} />

            {/* U4: Matching Page */}
            <Route path="/matching" element={<U4MatchingPage />} />

            {/* U5: Groups */}
            <Route path="/groups" element={<U5GroupsPage />} />

            {/* U6: Appointments */}
            <Route path="/appointments" element={<U6AppointmentsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
