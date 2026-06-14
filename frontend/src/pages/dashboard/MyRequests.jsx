import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Clock, MapPin, Phone, HeartPulse, Activity } from 'lucide-react';

export function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/requests/my-requests');
        if (data.success) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleMarkCompleted = async (requestId) => {
    try {
      const { data } = await api.put(`/requests/${requestId}/status`, { status: 'Completed' });
      if (data.success) {
        setRequests(prev => prev.map(req => req._id === requestId ? { ...req, status: 'Completed' } : req));
        setSelectedRequest(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Blood Requests</h1>
        <p className="text-slate-500">History of all requests you have created.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-slate-500">Loading your requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center text-slate-500">You haven't created any requests yet.</div>
          ) : requests.map((req) => (
            <div key={req._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {req.bloodGroup}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">For: {req.patientName}</h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {req.hospital}, {req.city}</span>
                    <span>•</span>
                    <span>{req.unitsRequired} Units</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={req.status === 'Completed' ? 'success' : req.status === 'Accepted' ? 'primary' : req.status === 'Closed' ? 'secondary' : 'warning'}>
                  {req.status}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedRequest(req)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Request Details"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-900">For: {selectedRequest.patientName}</h4>
                <Badge variant={selectedRequest.status === 'Completed' ? 'success' : selectedRequest.status === 'Accepted' ? 'primary' : 'warning'}>
                  {selectedRequest.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">{selectedRequest.hospital}, {selectedRequest.city}</p>
              <div className="flex gap-4 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-1 text-brand-600">
                  <HeartPulse size={16} /> {selectedRequest.bloodGroup}
                </span>
                <span>{selectedRequest.unitsRequired} Units</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-brand-500" />
                Accepted Donors ({selectedRequest.acceptedDonors?.length || 0})
              </h4>
              
              {(!selectedRequest.acceptedDonors || selectedRequest.acceptedDonors.length === 0) ? (
                <div className="text-center p-6 bg-slate-50 rounded-xl text-slate-500">
                  <p>No donors have accepted this request yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRequest.acceptedDonors.map((match, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-900">{match.donor?.name || 'Unknown Donor'}</p>
                          <p className="text-sm text-brand-600 font-medium">{match.donor?.bloodGroup}</p>
                        </div>
                        <a 
                          href={`tel:${match.donor?.phone}`}
                          className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 transition-colors"
                          title="Call Donor"
                        >
                          <Phone size={18} />
                        </a>
                      </div>
                      <div className="mt-3 text-sm text-slate-600 flex items-center gap-2">
                        <Phone size={14} className="text-slate-400" />
                        {match.donor?.phone}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedRequest.status !== 'Completed' && selectedRequest.status !== 'Closed' && (
              <div className="pt-4 border-t border-slate-100">
                <Button fullWidth onClick={() => handleMarkCompleted(selectedRequest._id)}>
                  Mark Request as Completed
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
