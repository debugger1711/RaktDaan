import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Globe, Share2, MessageCircle } from 'lucide-react';

export function Footer() {
  const handleNavClick = (e, id) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" onClick={(e) => handleNavClick(e, 'root')} className="flex items-center gap-2 mb-4">
              <div className="bg-brand-600 p-1.5 rounded-lg">
                <Heart className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">RaktDaan</span>
            </Link>
            <p className="text-sm text-navy-200 mb-6 leading-relaxed">
              Connecting blood donors with patients and hospitals during emergencies. Saving lives, one drop at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-navy-300 hover:text-white transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="text-navy-300 hover:text-white transition-colors">
                <Share2 size={20} />
              </a>
              <a href="#" className="text-navy-300 hover:text-white transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-brand-400 transition-colors">About Us</Link></li>
              <li><Link to="/#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-brand-400 transition-colors">FAQ</Link></li>
              <li><Link to="/#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="hover:text-brand-400 transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#blood-camps" onClick={(e) => handleNavClick(e, 'blood-camps')} className="hover:text-brand-400 transition-colors">Blood Camps</Link></li>
              <li><Link to="/#emergency" onClick={(e) => handleNavClick(e, 'emergency')} className="hover:text-brand-400 transition-colors">Emergency Requests</Link></li>
              <li><Link to="/#health-checkups" onClick={(e) => handleNavClick(e, 'health-checkups')} className="hover:text-brand-400 transition-colors">Health Checkups</Link></li>
              <li><Link to="/#corporate" onClick={(e) => handleNavClick(e, 'corporate')} className="hover:text-brand-400 transition-colors">Corporate Partnerships</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Community</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/#events" onClick={(e) => handleNavClick(e, 'events')} className="hover:text-brand-400 transition-colors">Events</Link></li>
              <li><Link to="/#health-tips" onClick={(e) => handleNavClick(e, 'health-tips')} className="hover:text-brand-400 transition-colors">Health Tips</Link></li>
              <li><Link to="/#donor-stories" onClick={(e) => handleNavClick(e, 'donor-stories')} className="hover:text-brand-400 transition-colors">Donor Stories</Link></li>
              <li><Link to="/#volunteer" onClick={(e) => handleNavClick(e, 'volunteer')} className="hover:text-brand-400 transition-colors">Volunteer</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-navy-400">
          <p>&copy; {new Date().getFullYear()} RaktDaan. All rights reserved.</p>
          <p>Made with care in India</p>
        </div>
      </div>
    </footer>
  );
}
