import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function DashboardLayout({ allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30 flex flex-col relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>
      <div className="relative z-10 w-full flex-col flex h-full min-h-screen">
      <Navbar />
      
      {/* Mobile sidebar toggle for dashboard only */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center sticky top-16 z-20">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 text-slate-600 font-medium text-sm"
        >
          <Menu size={18} />
          <span>Dashboard Menu</span>
        </button>
      </div>

      <div className="flex flex-1 relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 w-full lg:pl-64">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      </div>
    </div>
  );
}
