import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import DonationForm from "../src/pages/DonationForm.jsx";
import RecipientForm from "../src/pages/RecipientForm.jsx";
import Volunteer from "../src/pages/Volunteer.jsx";
import Receiver from "../src/pages/Receiver.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donation-form" element={<DonationForm />} />
      <Route path="/volunteer" element={<Volunteer />} />
      <Route path="/receive-donation" element={<Receiver />} />
      <Route path="/recipient-form" element={<RecipientForm />} />
    </Routes>
  );
};

export default AppRoutes;