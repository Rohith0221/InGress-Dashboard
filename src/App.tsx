import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { EventsDashboard } from './pages/EventsDashboard';
import { DlqDashboard } from './pages/DlqDashboard';
import './App.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
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
            <EventsDashboard />
          </ProtectedRoute>
          } />
          <Route
            path="/dlq"
            element={
              <ProtectedRoute>
                <DlqDashboard />
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
