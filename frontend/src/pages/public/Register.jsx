import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Phone, MapPin, Lock, Droplets } from 'lucide-react';
import { bloodGroups } from '../../utils/mockData';
import { cn } from '../../utils/cn';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    bloodGroup: '',
    password: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    
    const payload = { ...formData };
    delete payload.confirmPassword;
    if (!payload.bloodGroup) {
      delete payload.bloodGroup;
    }

    const result = await register(payload);
    
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden">
      
      {/* Abstract Background Glowing Orbs (Light Theme) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-300/30 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-300/30 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>
      
      {/* Subtle Dot Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <User className="h-8 w-8 text-red-600" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Join RaktDaan</h2>
          <p className="mt-3 text-base text-slate-600">
            Create an account to start saving lives or requesting blood
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              icon={User}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              icon={Mail}
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              required
              icon={Phone}
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
            <Input
              label="City"
              name="city"
              type="text"
              required
              icon={MapPin}
              placeholder="e.g. New Delhi"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Blood Group (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-500">
                <Droplets size={18} />
              </div>
              <select 
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm appearance-none"
              >
                <option value="" disabled>Select Blood Group</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-600 cursor-pointer">
              I agree to the <Link to="/terms" className="text-brand-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            Create Account
          </Button>
          
          <div className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
              Sign in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
