/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import SeriesDetails from './pages/SeriesDetails';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useStore } from './store';

// A simple protected route wrapper
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAdmin = useStore((state) => state.isAdmin);
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Guest Routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/series/:id" element={<SeriesDetails />} />
        </Route>
        
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
