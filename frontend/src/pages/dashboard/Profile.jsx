import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Phone, MapPin, Mail, Calendar, Key, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { bloodGroups } from '../../utils/mockData';

export function Profile() {
  const { user, updateUser } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    city: '',
    address: '',
    isAvailable: true,
    lastDonationDate: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch initial profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        if (data.success) {
          const profile = data.data;
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            bloodGroup: profile.bloodGroup || '',
            city: profile.city || '',
            address: profile.address || '',
            isAvailable: profile.isAvailable ?? true,
            lastDonationDate: profile.lastDonationDate 
              ? new Date(profile.lastDonationDate).toISOString().split('T')[0] 
              : '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    setProfileLoading(true);

    try {
      const { data } = await api.put('/users/profile', {
        name: profileData.name,
        phone: profileData.phone,
        city: profileData.city,
        address: profileData.address,
        bloodGroup: profileData.bloodGroup,
        lastDonationDate: profileData.lastDonationDate || null,
      });

      if (data.success) {
        setProfileSuccess('Profile details updated successfully.');
        updateUser({
          name: data.data.name,
          phone: data.data.phone,
          city: data.data.city,
          bloodGroup: data.data.bloodGroup,
          lastDonationDate: data.data.lastDonationDate,
        });
      }
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile details');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const { data } = await api.put('/users/availability');
      if (data.success) {
        setProfileData(prev => ({ ...prev, isAvailable: data.data.isAvailable }));
        updateUser({ isAvailable: data.data.isAvailable });
        setProfileSuccess(`Availability status updated to ${data.data.isAvailable ? 'Available' : 'Unavailable'}.`);
        setTimeout(() => setProfileSuccess(''), 4000);
      }
    } catch (error) {
      setProfileError('Failed to toggle availability.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError('New passwords do not match');
    }

    if (passwordData.newPassword.length < 6) {
      return setPasswordError('Password must be at least 6 characters long');
    }

    setPasswordLoading(true);
    try {
      const { data } = await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (data.success) {
        setPasswordSuccess('Password updated successfully.');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your profile details and account security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Availability Card / Left Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center p-6 space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-3xl shadow-sm border border-brand-100">
              {profileData.bloodGroup || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profileData.name}</h2>
              <p className="text-slate-500 text-sm">{profileData.email}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-700">Donation Availability</p>
                  <p className="text-xs text-slate-500">Are you available to donate now?</p>
                </div>
                <button
                  onClick={handleToggleAvailability}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${profileData.isAvailable ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${profileData.isAvailable ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-left space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Donations</span>
                <p className="text-xl font-bold text-slate-900">{user?.totalDonations || 0} times</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Profile / Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {profileSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <CheckCircle size={18} className="text-green-600" />
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={18} className="text-red-600" />
                    {profileError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    icon={User}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    value={profileData.email}
                    icon={Mail}
                    disabled
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    icon={Phone}
                    required
                  />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={profileData.bloodGroup}
                      onChange={handleProfileChange}
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="City"
                    name="city"
                    value={profileData.city}
                    onChange={handleProfileChange}
                    icon={MapPin}
                    required
                  />
                  <Input
                    label="Last Donation Date"
                    name="lastDonationDate"
                    type="date"
                    value={profileData.lastDonationDate}
                    onChange={handleProfileChange}
                    icon={Calendar}
                  />
                </div>

                <Input
                  label="Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  icon={MapPin}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={profileLoading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Shield size={20} className="text-slate-400" />
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {passwordSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <CheckCircle size={18} className="text-green-600" />
                    {passwordSuccess}
                  </div>
                )}
                {passwordError && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={18} className="text-red-600" />
                    {passwordError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    icon={Key}
                    required
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    icon={Key}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    icon={Key}
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={passwordLoading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
