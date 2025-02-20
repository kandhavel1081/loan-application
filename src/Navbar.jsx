import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import logo from './assets/logo.png'; // Import the logo image

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full mr-2" />
          <div className="text-white text-2xl font-bold">Kandhavel Finance</div>
        </div>
        <div className="block lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
        <ul className={`flex-col lg:flex-row lg:flex ${isOpen ? 'flex' : 'hidden'} space-y-4 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0`}>
          <li><a href="#" onClick={() => navigate('/home')} className="text-white hover:text-gray-300">Home</a></li>
          <li><a href="#" onClick={() => navigate('/emi-calculator')} className="text-white hover:text-gray-300">EMI Calculator</a></li>
          <li><a href="https://consumer.experian.in/ECV-OLN/view/angular/#/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">Check CIBIL Score</a></li>
          <li><a href="#" onClick={() => navigate('/profile')} className="text-white hover:text-gray-300">My Profile</a></li>
          <li><a href="#" onClick={() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' })} className="text-white hover:text-gray-300">About Us</a></li>
          <li>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;