import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { MapPin, Droplets, Search, Activity, User, Phone } from 'lucide-react';
import { bloodGroups } from '../../utils/mockData';
import { Modal } from '../../components/ui/Modal';

export function SearchDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    city: '',
  });

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.bloodGroup) queryParams.append('bloodGroup', filters.bloodGroup);
      if (filters.city) queryParams.append('city', filters.city);
      
      const { data } = await api.get(`/donors/search?${queryParams.toString()}`);
      if (data.success) {
        setDonors(data.data);
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial donors (or latest active donors)
  useEffect(() => {
    fetchDonors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Search Donors</h1>
        <p className="text-slate-500">Find eligible blood donors in your area.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-500">
                  <Droplets size={18} />
                </div>
                <select 
                  value={filters.bloodGroup}
                  onChange={(e) => setFilters(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm appearance-none"
                >
                  <option value="">Any Blood Group</option>
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 w-full">
              <Input
                label="City"
                icon={MapPin}
                placeholder="e.g. New Delhi"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
              <Search size={18} />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500">Searching for donors...</div>
        ) : donors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-slate-400" size={32} />
            </div>
            <p className="text-lg font-medium text-slate-900">No donors found</p>
            <p>Try adjusting your search filters to find more donors.</p>
          </div>
        ) : (
          donors.map(donor => (
            <Card key={donor._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{donor.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin size={14} />
                        {donor.city || 'No city specified'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={donor.isAvailable ? 'success' : 'secondary'}>
                    {donor.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Donations</p>
                    <p className="font-semibold text-slate-900 flex items-center gap-1">
                      <Activity size={14} className="text-brand-500" />
                      {donor.totalDonations || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Last Donated</p>
                    <p className="font-semibold text-slate-900">
                      {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                </div>

                <Button 
                  fullWidth 
                  variant="outline" 
                  className="mt-2 flex items-center justify-center gap-2" 
                  disabled={!donor.isAvailable}
                  onClick={() => setSelectedDonor(donor)}
                >
                  <Phone size={16} />
                  Contact Donor
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        isOpen={!!selectedDonor}
        onClose={() => setSelectedDonor(null)}
        title="Donor Contact Details"
      >
        {selectedDonor && (
          <div className="space-y-4">
            <div className="bg-brand-50 p-4 rounded-xl text-center">
              <h4 className="text-lg font-bold text-slate-900">{selectedDonor.name}</h4>
              <p className="text-brand-600 font-medium">{selectedDonor.bloodGroup} Blood Donor</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 text-sm">Phone Number</span>
                <span className="font-semibold text-slate-900">{selectedDonor.phone}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-500 text-sm">City</span>
                <span className="font-semibold text-slate-900">{selectedDonor.city || 'Not specified'}</span>
              </div>
            </div>

            <Button 
              fullWidth 
              className="mt-4"
              onClick={() => {
                window.location.href = `tel:${selectedDonor.phone}`;
              }}
            >
              Call Now
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
