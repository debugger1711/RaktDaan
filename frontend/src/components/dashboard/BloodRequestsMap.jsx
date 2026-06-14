import React, { useEffect, useRef, useState } from 'react';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { MapPin, AlertCircle } from 'lucide-react';

// Coordinates for major Indian cities
const cityCoords = {
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'noida': [28.5355, 77.3910],
  'gurugram': [28.4595, 77.0266],
  'mumbai': [19.0760, 72.8777],
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'kolkata': [22.5726, 88.3639],
  'chennai': [13.0827, 80.2707],
  'hyderabad': [17.3850, 78.4867],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'lucknow': [26.8467, 80.9462],
  'patna': [25.5941, 85.1376],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'chandigarh': [30.7333, 76.7794],
  'ludhiana': [30.9010, 75.8573],
  'kanpur': [26.4499, 80.3319],
  'surat': [21.1702, 72.8311],
  'nagpur': [21.1458, 79.0882],
};

export function BloodRequestsMap({ onSelectRequest }) {
  const { user } = useAuth();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch active requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await api.get('/requests?status=Pending');
        if (data.success) {
          setRequests(data.data || []);
        }
      } catch (err) {
        console.error('Error loading map requests:', err);
        setError('Failed to load active requests for map.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (loading || error || !window.L || !mapContainerRef.current) return;

    // Determine user's city coordinates or default to Delhi
    const userCity = user?.city?.toLowerCase().trim() || 'delhi';
    const defaultCenter = cityCoords[userCity] || [28.6139, 77.2090];

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 11,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    } else {
      // If map is already initialized, pan to center
      mapInstanceRef.current.setView(defaultCenter, 11);
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Custom Red Drop Marker Icon using inline SVG
    const redIcon = window.L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 border-2 border-red-500 shadow-md text-brand-600 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-map-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // Add markers for each request
    requests.forEach((req, idx) => {
      const cityKey = req.city?.toLowerCase().trim() || 'delhi';
      const baseCoords = cityCoords[cityKey] || [28.6139, 77.2090];
      
      // Add a tiny random offset to separate pins in the same city
      // We use the index to ensure consistent offset positioning
      const sameCityRequests = requests.filter(r => r.city?.toLowerCase().trim() === cityKey);
      const angle = (idx * 2 * Math.PI) / Math.max(1, sameCityRequests.length);
      const radius = 0.012; // about 1-2km dispersion
      const latOffset = Math.sin(angle) * radius * 0.7;
      const lngOffset = Math.cos(angle) * radius * 0.7;
      
      const coords = [baseCoords[0] + latOffset, baseCoords[1] + lngOffset];

      const marker = window.L.marker(coords, { icon: redIcon }).addTo(map);

      // Popup content template
      const popupHTML = `
        <div class="p-2 space-y-1.5 text-slate-800" style="min-width: 180px;">
          <div class="flex justify-between items-center gap-3">
            <h4 class="font-bold text-sm text-slate-900" style="margin:0;">For: ${req.patientName}</h4>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-600" style="white-space:nowrap;">${req.bloodGroup}</span>
          </div>
          <p class="text-xs font-semibold text-slate-600" style="margin:2px 0;">${req.hospital}</p>
          <p class="text-xs text-slate-500" style="margin:2px 0;">${req.city} • ${req.unitsRequired} Unit(s)</p>
          <div class="pt-2 border-t border-slate-100 flex justify-end" style="margin-top:6px;">
            <button 
              id="map-details-${req._id}"
              class="w-full text-center py-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHTML);
      markersRef.current.push(marker);

      // Hook up details button click when popup is opened
      marker.on('popupopen', () => {
        const btn = document.getElementById(`map-details-${req._id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectRequest(req);
            marker.closePopup();
          };
        }
      });
    });

    // Cleanup on unmount
    return () => {
      // Leaflet cleanup is handled when component leaves page or is recreated
    };
  }, [loading, error, requests, user]);

  return (
    <Card className="shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="text-brand-600" size={18} />
          Live Requests
        </CardTitle>
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {requests.length} Active
        </span>
      </CardHeader>
      <CardContent className="p-0 border-t border-slate-100 flex-1 flex flex-col min-h-[16rem]">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 bg-slate-50 min-h-[16rem]">
            Loading interactive map...
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500 bg-slate-50 gap-2 p-6 min-h-[16rem]">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        ) : (
          <div className="relative flex-1 flex flex-col min-h-[16rem]">
            <div 
              ref={mapContainerRef} 
              id="requests-map" 
              className="flex-1 w-full z-10 min-h-[16rem]" 
              style={{ borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
