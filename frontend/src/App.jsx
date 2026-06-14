import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ScrollToHash } from './components/layout/ScrollToHash';

// Public Pages
import { Landing } from './pages/public/Landing';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { GenericPage } from './pages/public/GenericPage';

// Dashboards
import { Dashboard } from './pages/dashboard/Dashboard';
import { CreateRequest } from './pages/dashboard/CreateRequest';
import { SearchDonors } from './pages/dashboard/SearchDonors';
import { MyRequests } from './pages/dashboard/MyRequests';
import { DonationHistory } from './pages/dashboard/DonationHistory';
import { Profile } from './pages/dashboard/Profile';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Generic Navbar Pages */}
            <Route path="/about" element={<GenericPage title="About Us" description="Learn more about RaktDaan and our mission to save lives." />} />
            <Route path="/events" element={<GenericPage title="Events" description="Upcoming events, seminars, and awareness programs." />} />
            
            {/* Services */}
            <Route path="/services/blood-camps" element={<GenericPage title="Blood Donation Camps" description="Find, organize, and participate in blood donation camps near you." />} />
            <Route path="/services/emergency" element={<GenericPage title="Emergency Requests" description="Urgent blood needs in your area that require immediate attention." />} />
            <Route path="/services/corporate" element={<GenericPage title="Corporate Partnerships" description="Partner with us for corporate social responsibility initiatives." />} />
            <Route path="/services/health-checkups" element={<GenericPage title="Health Checkups" description="Regular health monitoring and free checkups for our frequent donors." />} />
            
            {/* Blog */}
            <Route path="/blog/health-tips" element={<GenericPage title="Health Tips" description="Expert advice on maintaining good health and preparing for blood donation." />} />
            <Route path="/blog/donor-stories" element={<GenericPage title="Donor Stories" description="Inspiring real-life stories from our everyday heroes." />} />
            <Route path="/blog/medical-research" element={<GenericPage title="Medical Research" description="Latest updates and breakthroughs in hematology and blood transfusion." />} />
            
            {/* Pages */}
            <Route path="/faq" element={<GenericPage title="Frequently Asked Questions" description="Find answers to common questions about blood donation and our platform." />} />
            <Route path="/contact" element={<GenericPage title="Contact Us" description="Get in touch with our team for support, queries, or feedback." />} />
            <Route path="/testimonials" element={<GenericPage title="Testimonials" description="Hear from patients whose lives were saved thanks to your donations." />} />
            <Route path="/volunteer" element={<GenericPage title="Volunteer With Us" description="Join our community of volunteers and help manage events and campaigns." />} />
            <Route path="/terms" element={<GenericPage title="Terms of Service" description="Read the rules and regulations governing the use of RaktDaan." />} />
            <Route path="/privacy" element={<GenericPage title="Privacy Policy" description="Understand how we collect, use, and protect your personal data." />} />

            {/* Fallbacks */}
            <Route path="/forgot-password" element={<Login />} />
            <Route path="/unauthorized" element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
              </div>
            } />
          </Route>

          {/* User Dashboard Routes */}
          <Route element={<DashboardLayout allowedRoles={['user', 'admin']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/create-request" element={<CreateRequest />} />
            <Route path="/dashboard/search-donors" element={<SearchDonors />} />
            <Route path="/dashboard/my-requests" element={<MyRequests />} />
            <Route path="/dashboard/history" element={<DonationHistory />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<DashboardLayout allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<div className="p-8">Manage Users</div>} />
            <Route path="/admin/requests" element={<div className="p-8">Manage Requests</div>} />
            <Route path="/admin/analytics" element={<div className="p-8">Detailed Analytics</div>} />
          </Route>

          {/* Shared Authenticated Routes */}
          <Route element={<DashboardLayout allowedRoles={['user', 'admin']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
