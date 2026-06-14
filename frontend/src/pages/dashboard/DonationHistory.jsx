import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { downloadCertificate } from '../../utils/certificateGenerator';
import { Droplets, Calendar, MapPin, Activity, Award } from 'lucide-react';

export function DonationHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          api.get('/donations'),
          api.get('/donations/stats')
        ]);
        if (historyRes.data.success) {
          setDonations(historyRes.data.data);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching donation history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Donation History</h1>
        <p className="text-slate-500">Track your life-saving contributions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-brand-50 p-3 rounded-xl text-brand-600">
                <Droplets size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats?.totalDonations || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Total Donations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                <Activity size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats?.totalUnits || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Total Units Donated</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <Activity size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats?.livesSaved || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Potential Lives Saved</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading your history...</div>
          ) : donations.length === 0 ? (
            <div className="p-6 text-center text-slate-500">You haven't made any donations yet.</div>
          ) : donations.map((donation) => (
            <div key={donation._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Droplets size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">{donation.hospital}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {donation.city}</span>
                    <span>•</span>
                    <span>{donation.units} Unit(s)</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(donation.donationDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {donation.status === 'Completed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 text-brand-600 border-brand-200 hover:bg-brand-50"
                    onClick={() => downloadCertificate({
                      donorName: user?.name || 'Donor',
                      donationDate: donation.donationDate || donation.createdAt,
                      bloodGroup: donation.bloodGroup,
                      hospital: donation.hospital,
                      city: donation.city,
                      units: donation.units
                    })}
                  >
                    <Award size={16} />
                    Certificate
                  </Button>
                )}
                <Badge variant={donation.status === 'Completed' ? 'success' : 'warning'}>
                  {donation.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
