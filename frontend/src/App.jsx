
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Facilities from "./pages/Facilities";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layouts/AppLayout";

function ComingSoon({ title }) {
  return (
    <div className="mx-auto w-full max-w-5xl p-6 sm:p-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
          ArenaTech Gujarat
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This module is planned for ArenaTech and will be connected when its
          backend functionality is implemented.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/facilities" element={<Facilities />} />

          <Route
            path="/events"
            element={<ComingSoon title="Sports Events" />}
          />
          <Route
            path="/bookings"
            element={<ComingSoon title="My Bookings" />}
          />
          <Route
            path="/training"
            element={<ComingSoon title="Training" />}
          />
          <Route
            path="/athletes"
            element={<ComingSoon title="Athletes" />}
          />
          <Route
            path="/maintenance"
            element={<ComingSoon title="Maintenance" />}
          />
          <Route
            path="/admin"
            element={<ComingSoon title="Administration" />}
          />
          <Route
            path="/admin/users"
            element={<ComingSoon title="User Management" />}
          />
          <Route
            path="/admin/facilities"
            element={<ComingSoon title="Facility Approvals" />}
          />
          <Route
            path="/profile"
            element={<ComingSoon title="My Profile" />}
          />
          <Route
            path="/settings"
            element={<ComingSoon title="Settings" />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
