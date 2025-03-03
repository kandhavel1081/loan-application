import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const EMICalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [emi, setEmi] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [data, setData] = useState({});

  const calculateEMI = (e) => {
    e.preventDefault();
    const principalAmount = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const tenure = parseFloat(time);

    if (isNaN(principalAmount) || isNaN(annualRate) || isNaN(tenure)) {
      alert('Please enter valid numbers');
      return;
    }

    const r = annualRate / 12 / 100;
    const t = tenure * 12;
    const emi = (principalAmount * r * Math.pow(1 + r, t)) / (Math.pow(1 + r, t) - 1);
    setEmi(emi.toFixed(2));

    const totalPayment = emi * t;
    const interestPayment = totalPayment - principalAmount;
    setTotalPayment(totalPayment.toFixed(2));

    setData({
      labels: ['Principal', 'Interest'],
      datasets: [
        {
          data: [principalAmount, interestPayment],
          backgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    });

    console.log('EMI:', emi);
    console.log('Total Payment:', totalPayment);
    console.log('Interest Payment:', interestPayment);
    console.log('Chart Data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">EMI Calculator</h2>
        <form onSubmit={calculateEMI} className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Principal Amount</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Loan Tenure (Years)</label>
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
          >
            Calculate EMI
          </button>
        </form>
        {emi && (
          <div className="mt-6 text-center">
            <h3 className="text-3xl font-bold text-gray-900">Estimated EMI: ₹{emi}</h3>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">Total Payment: ₹{totalPayment}</h3>
            <div className="mt-6 w-80 mx-auto">
              <Doughnut data={data} />
            </div>
          </div>
        )}
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

export default EMICalculator;