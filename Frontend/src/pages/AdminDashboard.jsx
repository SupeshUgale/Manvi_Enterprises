import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome, {user?.name || user?.fullName || 'Admin'}!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 p-4 rounded border border-emerald-200">
            <h3 className="text-sm font-medium text-emerald-800">Account Role</h3>
            <p className="text-xl font-bold text-emerald-900 capitalize">{user?.role || 'Admin'}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800">Status</h3>
            <p className="text-xl font-bold text-blue-900">Active</p>
          </div>
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <h3 className="text-sm font-medium text-purple-800">Email</h3>
            <p className="text-sm font-semibold text-purple-900 truncate">{user?.email || 'N/A'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;