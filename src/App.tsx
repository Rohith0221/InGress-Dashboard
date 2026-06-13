import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import './App.css'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const EndpointsPlaceholder = () => (

  <div className="p-8 min-h-screen bg-background">
    <h1 className="text-2xl font-bold">InGress Endpoints Dashboard</h1>
    <p className="text-muted-foreground mt-2">Authentication successful. Data Engine pending.</p>
  </div>
);

export const App = () => {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route 
          path="/endpoints" 
          element={
          <ProtectedRoute>
            <EndpointsPlaceholder />
          </ProtectedRoute>
        } 
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/endpoints" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App
