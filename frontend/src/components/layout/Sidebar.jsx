import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  Clock, 
  Settings, 
  Bell, 
  Users, 
  Activity, 
  FileText,
  User as UserIcon,
  Home
} from 'lucide-react';
import { cn } from '../../utils/cn';

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Overview', path: '/admin', icon: LayoutDashboard },
          { name: 'Users', path: '/admin/users', icon: Users },
          { name: 'Requests', path: '/admin/requests', icon: FileText },
          { name: 'Analytics', path: '/admin/analytics', icon: Activity },
          { name: 'Settings', path: '/profile', icon: Settings },
        ];
      case 'user':
        return [
          { name: 'Home', path: '/', icon: Home },
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Create Request', path: '/dashboard/create-request', icon: Search },
          { name: 'Search Donors', path: '/dashboard/search-donors', icon: Search },
          { name: 'My Requests', path: '/dashboard/my-requests', icon: FileText },
          { name: 'Donation History', path: '/dashboard/history', icon: Clock },
          { name: 'Profile', path: '/profile', icon: UserIcon },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:absolute top-16 lg:top-0 bottom-0 left-0 z-30 w-64 bg-white/80 backdrop-blur-xl border-r border-white/60 transform transition-transform duration-200 ease-in-out lg:translate-x-0 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="py-6 px-4">
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/' || link.path === '/admin' || link.path === '/dashboard'}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group hover:translate-x-1",
                    isActive 
                      ? "bg-brand-50 text-brand-700 shadow-sm" 
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} className={cn(
                        "transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-brand-600" : "text-slate-400 group-hover:text-brand-500"
                      )} />
                      {link.name}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
