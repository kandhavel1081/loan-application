import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import logo from './assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Close mobile menu when navigating or resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleScrollToFooter = () => {
    document.getElementById('footer').scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-500 p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full mr-2" />
          <div className="text-white text-xl md:text-2xl font-bold">Kandhavel Finance</div>
        </div>
        
        {/* Mobile menu button */}
        <div className="block lg:hidden">
          <button 
            onClick={toggleMenu} 
            className="text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
        
        {/* Desktop menu */}
        <ul className="hidden lg:flex space-x-6 items-center">
          <li><button onClick={() => handleNavigation('/home')} className="text-white hover:text-gray-200 transition">Home</button></li>
          <li><button onClick={() => handleNavigation('/emi-calculator')} className="text-white hover:text-gray-200 transition">EMI Calculator</button></li>
          <li><a href="https://consumer.experian.in/ECV-OLN/view/angular/#/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition">Check CIBIL Score</a></li>
          <li><button onClick={() => handleNavigation('/profile')} className="text-white hover:text-gray-200 transition">My Profile</button></li>
          <li><button onClick={handleScrollToFooter} className="text-white hover:text-gray-200 transition">About Us</button></li>
          <li>
            <button 
              onClick={handleLogout}
              className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
      
      {/* Mobile menu - Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      ></div>
      
      {/* Mobile menu - Content */}
      <div 
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-blue-600 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white font-bold text-xl">Menu</div>
            <button 
              className="text-white"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <ul className="space-y-4">
            <li><button onClick={() => handleNavigation('/home')} className="w-full text-left py-2 text-white hover:text-gray-200">Home</button></li>
            <li><button onClick={() => handleNavigation('/emi-calculator')} className="w-full text-left py-2 text-white hover:text-gray-200">EMI Calculator</button></li>
            <li><a href="https://consumer.experian.in/ECV-OLN/view/angular/#/" target="_blank" rel="noopener noreferrer" className="block py-2 text-white hover:text-gray-200">Check CIBIL Score</a></li>
            <li><button onClick={() => handleNavigation('/profile')} className="w-full text-left py-2 text-white hover:text-gray-200">My Profile</button></li>
            <li><button onClick={handleScrollToFooter} className="w-full text-left py-2 text-white hover:text-gray-200">About Us</button></li>
            <li className="pt-4">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;