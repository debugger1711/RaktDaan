import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Droplets, Clock, Activity, MapPin, CheckCircle, X, PlusCircle, FileText, Phone, HeartPulse } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { BloodRequestsMap } from '../../components/dashboard/BloodRequestsMap';

export function Dashboard() {
  const { user } = useAuth();
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [acceptSuccess, setAcceptSuccess] = useState('');
  const [acceptError, setAcceptError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nearbyRes, myRes] = await Promise.all([
          api.get('/requests?status=Pending&limit=5'),
          api.get('/requests/my-requests')
        ]);
        
        if (nearbyRes.data.success) {
          setNearbyRequests(nearbyRes.data.data || []);
        }
        if (myRes.data.success) {
          setMyRequests(myRes.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle viewing specific request from notification URL
  useEffect(() => {
    const reqId = searchParams.get('requestId');
    if (reqId && reqId !== '[object Object]') {
      const fetchRequest = async () => {
        try {
          const res = await api.get(`/requests/${reqId}`);
          if (res.data.success) {
            setSelectedRequest(res.data.data);
            // Remove from URL so it doesn't pop up again on refresh
            searchParams.delete('requestId');
            setSearchParams(searchParams, { replace: true });
          }
        } catch (error) {
          console.error('Error fetching specific request:', error);
        }
      };
      fetchRequest();
    }
  }, [searchParams, setSearchParams]);

  const calculateDaysSinceDonation = () => {
    if (!user?.lastDonationDate) return 'Never';
    const days = Math.floor((new Date() - new Date(user.lastDonationDate)) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  const isEligible = () => {
    if (!user?.lastDonationDate) return true;
    const days = Math.floor((new Date() - new Date(user.lastDonationDate)) / (1000 * 60 * 60 * 24));
    return days >= 56;
  };

  const handleAcceptRequest = async (requestId) => {
    setAcceptError('');
    setAcceptSuccess('');
    try {
      const { data } = await api.post(`/requests/${requestId}/accept`);
      if (data.success) {
        setAcceptSuccess('Thank you! You have successfully accepted this request. The recipient has been notified.');
        setNearbyRequests(prev => prev.filter(req => req._id !== requestId));
        if (selectedRequest && selectedRequest._id === requestId) {
          setSelectedRequest(prev => ({
            ...prev,
            status: 'Accepted',
            acceptedDonors: [...(prev.acceptedDonors || []), { donor: user }]
          }));
        }
        setTimeout(() => setAcceptSuccess(''), 5000);
      }
    } catch (error) {
      setAcceptError(error.response?.data?.message || 'Failed to accept request');
      setTimeout(() => setAcceptError(''), 5000);
    }
  };

  const handleMarkCompleted = async (requestId) => {
    try {
      const { data } = await api.put(`/requests/${requestId}/status`, { status: 'Completed' });
      if (data.success) {
        setMyRequests(prev => prev.map(req => req._id === requestId ? { ...req, status: 'Completed' } : req));
        setSelectedRequest(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const activeRequests = myRequests.filter(req => req.status !== 'Completed' && req.status !== 'Closed');

  const isOwnRequest = selectedRequest && (selectedRequest.requester?._id === user?._id || selectedRequest.requester === user?._id);
  const hasAccepted = selectedRequest && selectedRequest.acceptedDonors?.some(
    match => (match.donor?._id || match.donor) === user?._id
  );

  return (
    <div className="space-y-6">
      {(acceptSuccess || acceptError) && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 ${acceptSuccess ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <div className="flex items-center gap-3">
            {acceptSuccess ? <CheckCircle size={20} className="text-green-600" /> : <X size={20} className="text-red-600" />}
            <p className="font-medium">{acceptSuccess || acceptError}</p>
          </div>
          <button onClick={() => { setAcceptSuccess(''); setAcceptError(''); }} className="opacity-70 hover:opacity-100">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight mb-2 flex flex-wrap items-center gap-x-2">
            Welcome back, 
            <span className="text-red-600">
              {user?.name}
            </span>
          </h1>
          <p className="text-base md:text-lg font-serif italic text-slate-500 tracking-wide">
            Here's what's happening with your donations and requests today.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex h-3 w-3 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${user?.isAvailable ? 'bg-green-400' : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${user?.isAvailable ? 'bg-green-500' : 'bg-slate-500'}`}></span>
            </div>
            <span className="text-sm font-medium text-slate-700">{user?.isAvailable ? 'Available' : 'Unavailable'}</span>
          </div>
          <Link to="/dashboard/create-request">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              Request Blood
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-50 p-3 rounded-xl text-red-600">
                <Droplets size={24} />
              </div>
              <Badge variant="primary">Blood Group</Badge>
            </div>
            <div className="text-3xl font-bold text-slate-900">{user?.bloodGroup || 'Not set'}</div>
            <p className="text-sm text-slate-500 mt-1">{user?.city || 'No city set'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                <Clock size={24} />
              </div>
              <Badge variant={isEligible() ? "default" : "secondary"}>Status</Badge>
            </div>
            <div className="text-3xl font-bold text-slate-900">{isEligible() ? 'Eligible' : 'Ineligible'}</div>
            <p className="text-sm text-slate-500 mt-1">Last donation: {calculateDaysSinceDonation()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <Activity size={24} />
              </div>
              <Badge variant="default">Total</Badge>
            </div>
            <div className="text-3xl font-bold text-slate-900">{user?.totalDonations || 0}</div>
            <p className="text-sm text-slate-500 mt-1">Lifesaving donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                <FileText size={24} />
              </div>
              <Badge variant="default">Requests</Badge>
            </div>
            <div className="text-3xl font-bold text-slate-900">{activeRequests.length}</div>
            <p className="text-sm text-slate-500 mt-1">Active requests created</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="flex flex-col h-full">
          <BloodRequestsMap onSelectRequest={setSelectedRequest} />
        </div>

        {/* Your Active Requests */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
            <CardTitle>Your Active Requests</CardTitle>
            <Link to="/dashboard/my-requests" className="text-sm text-brand-600 font-medium hover:text-brand-700">View All</Link>
          </CardHeader>
          <div className="divide-y divide-slate-100 flex-1">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading your requests...</div>
            ) : activeRequests.length === 0 ? (
              <div className="p-6 text-center text-slate-500">You don't have any active requests.</div>
            ) : activeRequests.slice(0, 3).map((req) => (
              <div key={req._id} className="p-6 flex flex-col justify-between gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">For: {req.patientName}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span>{req.hospital}</span>
                      <span>•</span>
                      <span>{req.unitsRequired} Units</span>
                    </div>
                  </div>
                  <Badge variant={req.status === 'Accepted' ? 'success' : 'warning'}>
                    {req.status}
                  </Badge>
                </div>
                <div className="flex justify-end">
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

        {/* Nearby Urgent Requests */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
            <CardTitle>Urgent Nearby Requests</CardTitle>
            <Link to="/dashboard/search-donors" className="text-sm text-brand-600 font-medium hover:text-brand-700">Search</Link>
          </CardHeader>
          <div className="divide-y divide-slate-100 flex-1">
            {loading ? (
              <div className="p-6 text-center text-slate-500">Loading requests...</div>
            ) : nearbyRequests.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No urgent requests nearby.</div>
            ) : nearbyRequests.map((req) => (
              <div key={req._id} className="p-6 flex flex-col justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-50 text-brand-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{req.hospital}</h4>
                      {req.urgency === 'Critical' && (
                        <Badge variant="danger">Critical</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {req.city}</span>
                      <span>•</span>
                      <span>{req.unitsRequired} Units</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRequest(req)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleAcceptRequest(req._id)}
                  >
                    Accept Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

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
                <Badge variant={selectedRequest.status === 'Accepted' ? 'success' : 'warning'}>
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

            {!isOwnRequest ? (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Requester</span>
                    <p className="font-semibold text-slate-900">{selectedRequest.requester?.name || 'Anonymous'}</p>
                  </div>
                  {selectedRequest.notes && (
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes / Reason</span>
                      <p className="text-sm text-slate-700">{selectedRequest.notes}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgency</span>
                    <div>
                      <Badge variant={selectedRequest.urgency === 'Critical' ? 'danger' : selectedRequest.urgency === 'High' ? 'warning' : 'secondary'}>
                        {selectedRequest.urgency}
                      </Badge>
                    </div>
                  </div>
                </div>

                {hasAccepted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-3 text-green-800 font-bold">
                      <CheckCircle size={20} className="text-green-600" />
                      <span>You have accepted this request!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Please contact the requester immediately to coordinate blood donation.
                    </p>
                    <div className="bg-white border border-green-100 rounded-lg p-4 flex items-center justify-between shadow-sm">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Contact Number</p>
                        <p className="text-lg font-bold text-slate-900">{selectedRequest.contactNumber}</p>
                        {selectedRequest.requester?.email && (
                          <p className="text-sm text-slate-500 mt-1">{selectedRequest.requester.email}</p>
                        )}
                      </div>
                      <a 
                        href={`tel:${selectedRequest.contactNumber}`}
                        className="p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                        title="Call Requester"
                      >
                        <Phone size={20} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4 text-center">
                    <p className="text-sm text-blue-700 font-medium">
                      You must accept this request to view the contact details.
                    </p>
                    {selectedRequest.status === 'Completed' || selectedRequest.status === 'Closed' ? (
                      <p className="text-sm text-slate-500">This request is no longer active.</p>
                    ) : (
                      <Button fullWidth onClick={() => handleAcceptRequest(selectedRequest._id)}>
                        Accept Request & Contact
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                    <Activity size={18} className="text-brand-500" />
                    Accepted Donors ({selectedRequest.acceptedDonors?.length || 0})
                  </h4>
                  
                  {(!selectedRequest.acceptedDonors || selectedRequest.acceptedDonors.length === 0) ? (
                    <div className="text-center p-6 bg-slate-50 rounded-xl text-slate-500">
                      <p>No donors have accepted this request yet.</p>
                      <p className="text-sm mt-1">We will notify you when someone accepts it.</p>
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
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
