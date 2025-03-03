import React from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    // Handle payment logic here
    alert('Payment of 99rs successful!');
    navigate('/auctioned-vehicles');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Payment</h2>
        <p className="text-center text-gray-700">You need to pay 99rs to view the Auctioned Vehicles.</p>
        <button
          onClick={handlePayment}
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Pay 99rs
        </button>
      </div>
    </div>
  );
};

export default Payment;