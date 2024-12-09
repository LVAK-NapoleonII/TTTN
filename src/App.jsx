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
import PrivateRoute from "./PrivateRoute";
function App() {
  return (
    <Router>
      <Header />
      <Hero />
      {/* trang chủ */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      {/* đăng nhập*/}
      <Routes>
        <Route path="/Login" element={<Login />} />
      </Routes>
      {/* đăng ký lịch làm việc*/}
      <Routes>
        <Route path="/AppointmentBooking" element={<AppointmentBooking />} />
      </Routes>
      {/* Quản lý tài khoản */}
      <Routes>
        <Route
          path="/AccountManagement"
          element={
            <PrivateRoute requiredRoles={["Admin"]}>
              <AccountManagement />
            </PrivateRoute>
          }
        />
      </Routes>
      {/* Xuất file excel */}
      <Routes>
        <Route path="/Exportexcel" element={<Exportexcel />} />
      </Routes>
      {/* Thống kê */}
      <Routes>
        <Route path="/Statistics" element={<Statistics />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
