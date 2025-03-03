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
import Navbar from './Navbar';
import Admin from './admin';
import PrivateRoute from './PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-500">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />} 
        />
        <Route 
          path="/home" 
          element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile /> : <Navigate to="/" />} 
        />
        <Route 
          path="/payment" 
          element={isLoggedIn ? <Payment /> : <Navigate to="/" />} 
        />
        <Route 
          path="/auctioned-vehicles" 
          element={isLoggedIn ? <AuctionedVehicles /> : <Navigate to="/" />} 
        />
        <Route 
          path="/emi-calculator" 
          element={isLoggedIn ? <EMICalculator /> : <Navigate to="/" />} 
        />
        <Route 
          path="/loan-repayment" 
          element={isLoggedIn ? <LoanRepayment /> : <Navigate to="/" />} 
        />
        <Route 
          path="/apply-loan" 
          element={isLoggedIn ? <ApplyLoan /> : <Navigate to="/" />} 
        />
        <Route 
          path="/buy-sell-insurance" 
          element={isLoggedIn ? <BuySellInsurance /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin" 
          element={isLoggedIn ? <Admin /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;