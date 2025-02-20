import React from 'react';
import { useNavigate } from 'react-router-dom';
import vehicle1 from './assets/vehicle1.jpg';
import vehicle2 from './assets/vehicle2.jpg';
import vehicle3 from './assets/vehicle3.jpg';

const AuctionedVehicles = () => {
  const navigate = useNavigate();

  const handleAvailClick = (price) => {
    const upiId = '9025645962@ibl'; // Replace with the actual UPI ID
    const url = `upi://pay?pa=${upiId}&pn=Kandhavel%20Finance&am=${price}&cu=INR&tn=Vehicle%20Purchase`;

    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Auctioned Vehicles</h2>
        <p className="text-center mb-6 text-gray-700">Users can buy vehicles auctioned due to loan defaults, offering a unique opportunity to purchase vehicles at competitive prices.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src={vehicle1} alt="Vehicle 1" className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Vehicle 1</h3>
            <p className="text-gray-700 mb-4">Price: ₹3,00,000</p>
            <button
              onClick={() => handleAvailClick(300000)}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Avail
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src={vehicle2} alt="Vehicle 2" className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Vehicle 2</h3>
            <p className="text-gray-700 mb-4">Price: ₹4,50,000</p>
            <button
              onClick={() => handleAvailClick(450000)}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Avail
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img src={vehicle3} alt="Vehicle 3" className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Vehicle 3</h3>
            <p className="text-gray-700 mb-4">Price: ₹5,00,000</p>
            <button
              onClick={() => handleAvailClick(500000)}
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Avail
            </button>
          </div>
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

export default AuctionedVehicles;