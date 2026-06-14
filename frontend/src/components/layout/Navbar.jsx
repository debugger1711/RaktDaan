import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { NotificationDropdown } from '../ui/NotificationDropdown';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, id) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group transition-all duration-300 hover:scale-105">
              <div className="relative transform transition-transform duration-500 group-hover:rotate-12">
                <Heart className="h-10 w-10 text-[#d92c2c] drop-shadow-md group-hover:text-red-500" fill="currentColor" strokeWidth={0} />
                <span className="absolute inset-0 flex items-center justify-center text-white text-[12px] font-bold">+</span>
              </div>
              <div className="font-serif italic font-extrabold text-4xl tracking-tight flex items-baseline relative pr-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-red-600 to-red-400 drop-shadow-sm transition-all duration-300 group-hover:from-red-500 group-hover:to-red-400">Rakt</span>
                <span className="text-slate-800 drop-shadow-sm transition-colors duration-300 group-hover:text-slate-900">Daan</span>
                <span className="absolute top-0 right-0 text-red-500 text-xl group-hover:animate-pulse not-italic">❤</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {!user ? (
              <>
                <Link to="/" className="text-slate-700 hover:text-red-600 text-sm font-semibold transition-colors">Home</Link>
                <Link to="/#about" onClick={(e) => handleNavClick(e, 'about')} className="text-slate-700 hover:text-red-600 text-sm font-semibold transition-colors">About</Link>
                
                {/* Services Dropdown */}
                <div className="relative group">
                  <button className="text-slate-700 hover:text-red-600 text-sm font-semibold transition-colors flex items-center gap-1 py-4">
                    Services <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-[90%] mt-2 w-56 rounded-xl shadow-2xl bg-white border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      <Link to="/#blood-camps" onClick={(e) => handleNavClick(e, 'blood-camps')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Blood Donation Camps</Link>
                      <Link to="/#emergency" onClick={(e) => handleNavClick(e, 'emergency')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Emergency Requests</Link>
                      <Link to="/#corporate" onClick={(e) => handleNavClick(e, 'corporate')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Corporate Partnerships</Link>
                      <Link to="/#health-checkups" onClick={(e) => handleNavClick(e, 'health-checkups')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Health Checkups</Link>
                    </div>
                  </div>
                </div>

                <Link to="/#events" onClick={(e) => handleNavClick(e, 'events')} className="text-slate-700 hover:text-red-600 text-sm font-semibold transition-colors">Events</Link>
                
                {/* Blog Dropdown */}
                <div className="relative group">
                  <button className="text-slate-700 hover:text-red-600 text-sm font-semibold transition-colors flex items-center gap-1 py-4">
                    Blog <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-[90%] mt-2 w-48 rounded-xl shadow-2xl bg-white border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      <Link to="/#health-tips" onClick={(e) => handleNavClick(e, 'health-tips')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Health Tips</Link>
                      <Link to="/#donor-stories" onClick={(e) => handleNavClick(e, 'donor-stories')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Donor Stories</Link>
                      <Link to="/#medical-research" onClick={(e) => handleNavClick(e, 'medical-research')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Medical Research</Link>
                    </div>
                  </div>
                </div>

                {/* Pages Dropdown */}
                <div className="relative group">
                  <button className="text-slate-700 hover:text-red-600 text-sm font-semibold transition-colors flex items-center gap-1 py-4">
                    Pages <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 top-[90%] mt-2 w-48 rounded-xl shadow-2xl bg-white border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="py-2">
                      <Link to="/#faq" onClick={(e) => handleNavClick(e, 'faq')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">FAQ</Link>
                      <Link to="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Contact Us</Link>
                      <Link to="/#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Testimonials</Link>
                      <Link to="/#volunteer" onClick={(e) => handleNavClick(e, 'volunteer')} className="block px-5 py-2.5 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors">Volunteer</Link>
                    </div>
                  </div>
                </div>

                <Link to="/login">
                  <Button className="bg-[#d92c2c] hover:bg-red-700 text-white shadow-lg shadow-red-200/50 border-0 rounded-full px-6 transition-all hover:-translate-y-0.5">Register / Login</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-slate-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">Home</Link>
                <Link to={dashboardLink} className="text-slate-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">Dashboard</Link>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2">
                  <NotificationDropdown />
                  <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Log out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-slate-200">
          <div className="pt-2 pb-3 space-y-1">
            {!user ? (
              <>
                <Link to="/#about" onClick={(e) => handleNavClick(e, 'about')} className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50">About Us</Link>
                <Link to="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-red-600 hover:bg-red-50">Contact</Link>
                <Link to="/login" className="block px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">Log in</Link>
                <Link to="/register" className="block px-4 py-2 text-base font-medium text-slate-900 hover:bg-slate-50">Register</Link>
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-sm text-slate-500 capitalize">{user.role}</div>
                </div>
                <Link to={dashboardLink} className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
