import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import { useAuth } from './hooks/auth/useAuth';
import { Login } from './pages/Login';
import { EventsDashboard } from './pages/EventsDashboard';
import { DlqDashboard } from './pages/DlqDashboard';
import { DashboardLayout } from './components/ui/DashboardLayout';
import './App.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route 
          path="/events" 
          element={
            
          <ProtectedRoute>
            <DashboardLayout>
              <EventsDashboard />
            </DashboardLayout>
          </ProtectedRoute>
          } />
          <Route
            path="/dlq"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DlqDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App
