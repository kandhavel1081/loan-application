import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './Login';
import HomePage from './Homepage';
import Profile from './Profile';
import Payment from './Payment';
import AuctionedVehicles from './AuctionedVehicles';
import EMICalculator from './EMICalculator';
import LoanRepayment from './LoanRepayment';
import ApplyLoan from './ApplyLoan';
import BuySellInsurance from './BuySellInsurance';
import Navbar from './Navbar'; // Import the Navbar component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (email, password, username, age, dob, aadhar, pan, contact) => {
    setIsLoggedIn(true);
    setUserDetails({ email, password, username, age, dob, aadhar, pan, contact });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        {isLoggedIn && <Navbar />} {/* Conditionally render the Navbar */}
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
          <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile userDetails={userDetails} /> : <Navigate to="/" />} />
          <Route path="/payment" element={isLoggedIn ? <Payment /> : <Navigate to="/" />} />
          <Route path="/auctioned-vehicles" element={isLoggedIn ? <AuctionedVehicles /> : <Navigate to="/" />} />
          <Route path="/emi-calculator" element={isLoggedIn ? <EMICalculator /> : <Navigate to="/" />} />
          <Route path="/loan-repayment" element={isLoggedIn ? <LoanRepayment /> : <Navigate to="/" />} />
          <Route path="/apply-loan" element={isLoggedIn ? <ApplyLoan /> : <Navigate to="/" />} />
          <Route path="/buy-sell-insurance" element={isLoggedIn ? <BuySellInsurance /> : <Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;