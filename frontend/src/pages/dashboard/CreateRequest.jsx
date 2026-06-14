import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, MapPin, Phone, Hospital, AlertCircle, FileText, Droplets } from 'lucide-react';
import { bloodGroups } from '../../utils/mockData';

export function CreateRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    unitsRequired: 1,
    hospital: '',
    city: '',
    contactNumber: '',
    urgency: 'Normal',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.bloodGroup) {
      return setError('Please select a blood group');
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/requests', formData);
      if (data.success) {
        navigate('/dashboard/my-requests');
      } else {
        setError(data.message || 'Failed to create request');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Blood Request</h1>
        <p className="text-slate-500">Post an emergency requirement and we'll notify eligible donors nearby.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Patient Name"
                name="patientName"
                required
                icon={User}
                placeholder="Name of the patient"
                value={formData.patientName}
                onChange={handleChange}
              />
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Blood Group Required <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-500">
                    <Droplets size={18} />
                  </div>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm appearance-none"
                  >
                    <option value="" disabled>Select Blood Group</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Units Required"
                name="unitsRequired"
                type="number"
                min="1"
                required
                icon={Droplets}
                placeholder="e.g. 2"
                value={formData.unitsRequired}
                onChange={handleChange}
              />

              <Input
                label="Contact Number"
                name="contactNumber"
                type="tel"
                required
                icon={Phone}
                placeholder="Attendant's contact number"
                value={formData.contactNumber}
                onChange={handleChange}
              />

              <Input
                label="Hospital Name"
                name="hospital"
                required
                icon={Hospital}
                placeholder="Where is the blood needed?"
                value={formData.hospital}
                onChange={handleChange}
              />

              <Input
                label="City"
                name="city"
                required
                icon={MapPin}
                placeholder="e.g. New Delhi"
                value={formData.city}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Urgency Level
                </label>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  {['Normal', 'High', 'Critical'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        formData.urgency === level 
                          ? level === 'Critical' ? 'bg-red-500 text-white shadow-sm' 
                            : level === 'High' ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-slate-400 pointer-events-none">
                    <FileText size={18} />
                  </div>
                  <textarea
                    name="notes"
                    rows="3"
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pl-10 text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 sm:text-sm"
                    placeholder="Any specific instructions for donors..."
                    value={formData.notes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => navigate('/recipient')}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
