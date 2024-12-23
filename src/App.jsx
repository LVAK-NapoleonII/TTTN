import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Container/Header/Header.jsx";
import Footer from "./Components/Container/Footer.jsx";
import Hero from "./Components/Container/Hero.jsx";
import Home from "./Components/Pages/Home.jsx";
import Login from "./Components/Pages/Login.jsx";
import AppointmentBooking from "./Components/Pages/AppointmentBooking.jsx";
import AccountManagement from "./Components/Pages/AccountManagement";
import Statistics from "./Components/Pages/Statistics.jsx";
import Exportexcel from "./Components/Pages/Exportexcel.jsx";
import Doctorschedule from "./Components/Pages/Doctorschedule.jsx";
import { AuthProvider } from "E:/takingcareFE/src/Components/AuthContext.jsx";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Hero />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/AppointmentBooking" element={<AppointmentBooking />} />
          <Route path="/AccountManagement" element={<AccountManagement />} />
          <Route path="/Exportexcel" element={<Exportexcel />} />
          <Route path="/Statistics" element={<Statistics />} />
          <Route path="/Doctorschedule" element={<Doctorschedule />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
