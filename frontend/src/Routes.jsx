import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Signup from "../src/pages/Signup.jsx";
import Login from "../src/pages/Login.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import DonationForm from "../src/pages/DonationForm.jsx";
import RecipientForm from "../src/pages/RecipientForm.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donation-form" element={<DonationForm />} />
      <Route path="/recipient-form" element={<RecipientForm />} />
    </Routes>
  );
};

export default AppRoutes;