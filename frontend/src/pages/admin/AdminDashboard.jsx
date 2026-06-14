import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, Activity, HeartPulse, CheckCircle } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#e63946', '#f87171', '#fb923c', '#fbbf24', '#34d399', '#2dd4bf', '#38bdf8', '#818cf8'];

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    activeRequests: 0,
    completedDonations: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [bloodData, setBloodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, monthlyRes, bloodRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/analytics/monthly'),
          api.get('/admin/analytics/blood-groups')
        ]);
        
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (monthlyRes.data.success) setMonthlyData(monthlyRes.data.data);
        if (bloodRes.data.success) setBloodData(bloodRes.data.data);
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
        <p className="text-slate-500">Real-time statistics and analytics for RaktDaan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-brand-50 p-3 rounded-xl text-brand-600">
                <Users size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.totalUsers?.toLocaleString() || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Total Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <HeartPulse size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.livesSaved?.toLocaleString() || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Potential Lives Saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-50 p-3 rounded-xl text-yellow-600">
                <Activity size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.activeRequests}</div>
            <p className="text-sm text-slate-500 mt-1">Active Emergencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stats.completedDonations.toLocaleString()}</div>
            <p className="text-sm text-slate-500 mt-1">Successful Donations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="donations" fill="#e63946" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blood Group Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bloodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="bloodGroup"
                    stroke="none"
                  >
                    {bloodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">{bloodData.length > 0 ? bloodData[0].bloodGroup : 'N/A'}</span>
                <span className="text-sm text-slate-500">Most Common</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
