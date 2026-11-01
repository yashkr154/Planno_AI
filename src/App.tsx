import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';

import { HomePage } from './pages/HomePage';
import { LoginPage, SignupPage } from './pages/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { DashboardOverviewPage } from './pages/DashboardOverviewPage';
import { AIPlannerPage } from './pages/AIPlannerPage';
import { EventsPage } from './pages/EventsPage';
import { VenueFinderPage } from './pages/VenueFinderPage';
import { GuestManagementPage } from './pages/GuestManagementPage';
import { InvitationPage } from './pages/InvitationPage';
import { FinancePage } from './pages/FinancePage';
import { CalendarPage } from './pages/CalendarPage';
import { VendorsPage } from './pages/VendorsPage';
import { GalleryPage } from './pages/GalleryPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Dashboard Workspace Routes - Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverviewPage />} />
              <Route path="ai-planner" element={<AIPlannerPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="venues" element={<VenueFinderPage />} />
              <Route path="guests" element={<GuestManagementPage />} />
              <Route path="invitations" element={<InvitationPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
