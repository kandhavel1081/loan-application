import React from 'react';
import { useNavigate } from 'react-router-dom';
import gold from './assets/gold.jpeg';
import home from './assets/home.jpeg';
import land from './assets/land.jpeg';
import vehicles from './assets/vehicles.jpeg';
import simplest from './assets/simplest.jpeg';
import fastest from './assets/fastest.jpeg';
import safest from './assets/safest.jpeg';
import smartest from './assets/smartest.jpeg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleApplyLoanClick = () => {
    navigate('/apply-loan');
  };

  const handleLoanRepaymentClick = () => {
    navigate('/loan-repayment');
  };

  const handleAuctionedVehiclesClick = () => {
    navigate('/auctioned-vehicles');
  };

  const handleBuySellInsuranceClick = () => {
    navigate('/buy-sell-insurance');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 md:p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleApplyLoanClick} className="text-black hover:underline text-xl md:text-2xl font-semibold">Apply for Loan</a>
          </div>
          <div className="p-8 md:p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleLoanRepaymentClick} className="text-black hover:underline text-xl md:text-2xl font-semibold">Loan Repayment</a>
          </div>
          <div className="p-8 md:p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleAuctionedVehiclesClick} className="text-black hover:underline text-xl md:text-2xl font-semibold">Auctioned Vehicles</a>
          </div>
          <div className="p-8 md:p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleBuySellInsuranceClick} className="text-black hover:underline text-xl md:text-2xl font-semibold">Buy or Sell Vehicles</a>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-blue-500">Avail an instant Loan in Simple steps</h2>
          <ul className="list-disc list-inside mt-6 text-gray-700 inline-block text-left text-lg">
            <li className="mb-4">Provide your Personal and Employment details</li>
            <li className="mb-4">Select a loan amount and tenure</li>
            <li className="mb-4">Verify your loan agreement and provide an e-consent</li>
            <li className="mb-4">Get an instant loan disbursal</li>
          </ul>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <img src={gold} alt="Gold Loan" className="w-full h-48 md:h-64 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105" />
            <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Only 2.10% interest for Gold loan</p>
          </div>
          <div className="text-center">
            <img src={home} alt="Home Loan" className="w-full h-48 md:h-64 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105" />
            <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Only 2.5% interest on Home loans</p>
          </div>
          <div className="text-center">
            <img src={land} alt="Land Loan" className="w-full h-48 md:h-64 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105" />
            <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Only 2.5% interest on Land loans</p>
          </div>
          <div className="text-center">
            <img src={vehicles} alt="Vehicle Loan" className="w-full h-48 md:h-64 object-cover rounded-lg transform transition-transform duration-300 hover:scale-105" />
            <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Only 5% interest on Vehicle loans</p>
          </div>
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-500">Get digital loan approval in 24-48 hours</h2>
          <p className="text-lg md:text-xl text-gray-700 mt-2">Avail loans up to € 5 crore</p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <img src={simplest} alt="Simplest" className="w-16 h-16 md:w-24 md:h-24 object-cover transform transition-transform duration-300 hover:scale-105 mx-auto" />
              <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Simplest</p>
            </div>
            <div className="text-center">
              <img src={fastest} alt="Fastest" className="w-16 h-16 md:w-24 md:h-24 object-cover transform transition-transform duration-300 hover:scale-105 mx-auto" />
              <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Fastest</p>
            </div>
            <div className="text-center">
              <img src={safest} alt="Safest" className="w-16 h-16 md:w-24 md:h-24 object-cover transform transition-transform duration-300 hover:scale-105 mx-auto" />
              <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Safest</p>
            </div>
            <div className="text-center">
              <img src={smartest} alt="Smartest" className="w-16 h-16 md:w-24 md:h-24 object-cover transform transition-transform duration-300 hover:scale-105 mx-auto" />
              <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">Smartest</p>
            </div>
          </div>
        </div>
      </div>
      <footer id="footer" className="bg-blue-500 p-4 mt-6">
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

export default HomePage;