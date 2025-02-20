import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoanRepayment = () => {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handlePaymentClick = () => {
    const upiId = '9025645962@ibl'; // Replace with the actual UPI ID
    const url = `upi://pay?pa=${upiId}&pn=Kandhavel%20Finance&am=${amount}&cu=INR&tn=Loan%20Repayment`;

    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Loan Repayment</h2>
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
          <h3 className="text-2xl font-bold mb-4 text-gray-900">Repayment Options</h3>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li className="mb-2">Online Payment</li>
            <li className="mb-2">Bank Transfer</li>
            <li className="mb-2">UPI Payment</li>
          </ul>
          <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
            Pay Now
          </button>
        </div>
      </div>
      <footer className="bg-blue-500 p-4 mt-6">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Kandhavel Finance. All rights reserved.</p>
          <p>Contact us: info@kandhavelfinance.com</p>
          <p>Contact: 9876543210</p>
          <p>Follow us on social media for the latest updates.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoanRepayment;