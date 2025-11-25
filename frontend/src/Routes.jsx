import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import DonationForm from "../src/pages/DonationForm.jsx";
import RecipientForm from "../src/pages/RecipientForm.jsx";
import Volunteer from "../src/pages/Volunteer.jsx";
import Receiver from "../src/pages/Receiver.jsx";
import Profile from "../src/pages/Profile.jsx";
import MyDonations from "../src/pages/MyDonations.jsx";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public route - only Home page is accessible without login */}
      <Route path="/" element={<Home />} />
      
      {/* Protected routes - require authentication */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/donation-form" 
        element={
          <ProtectedRoute>
            <DonationForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/volunteer" 
        element={
          <ProtectedRoute>
            <Volunteer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/receive-donation" 
        element={
          <ProtectedRoute>
            <Receiver />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recipient-form" 
        element={
          <ProtectedRoute>
            <RecipientForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-donations" 
        element={
          <ProtectedRoute>
            <MyDonations />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;