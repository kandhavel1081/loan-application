import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import logo from './assets/logo.png'; // Import the logo

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [dob, setDob] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [pan, setPan] = useState('');
  const [contact, setContact] = useState('');

  const navigate = useNavigate();

  // Add validation functions
  const validateName = (value) => {
    return /^[A-Za-z\s]+$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateAadhar = (value) => {
    return /^\d{12}$/.test(value);
  };

  const validatePan = (value) => {
    return /^[A-Z0-9]{10}$/.test(value);
  };

  const validateContact = (value) => {
    return /^\d{10}$/.test(value);
  };

  const validatePassword = (value) => {
    return value.length >= 8;
  };

  // Update the input handlers with validation
  const handleInputChange = (e, setter) => {
    const { id, value } = e.target;
    
    switch (id) {
      case 'username':
        if (value === '' || validateName(value)) {
          setter(value);
        }
        break;
      case 'email':
        setter(value);
        break;
      case 'aadhar':
        if (value === '' || /^\d{0,12}$/.test(value)) {
          setter(value);
        }
        break;
      case 'pan':
        if (value === '' || /^[A-Z0-9]*$/.test(value.toUpperCase())) {
          setter(value.toUpperCase());
        }
        break;
      case 'contact':
        if (value === '' || /^\d{0,10}$/.test(value)) {
          setter(value);
        }
        break;
      default:
        setter(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      // Validate all fields before submission
      if (!validateName(username)) {
        toast.error('Name should only contain alphabets');
        return;
      }
      if (!validateEmail(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      if (!validateAadhar(aadhar)) {
        toast.error('Aadhar number should be 12 digits');
        return;
      }
      if (!validatePan(pan)) {
        toast.error('PAN should be 10 characters alphanumeric');
        return;
      }
      if (!validateContact(contact)) {
        toast.error('Contact number should be 10 digits');
        return;
      }
      if (!validatePassword(password)) {
        toast.error('Password should be at least 8 characters long');
        return;
      }
    }

    try {
      if (isRegistering) {
        // Create new user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email,
          username,
          age,
          dob,
          aadhar,
          pan,
          contact,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        toast.success('Registration successful!');
        navigate('/home');
      } else if (step === 1) {
        // Sign in existing user with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setStep(2);
      } else {
        // Update additional info in Firestore
        const user = auth.currentUser;
        if (user) {
          await setDoc(doc(db, 'users', user.uid), {
            username,
            age,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
        navigate('/home');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center">
          <img src={logo} alt="Kandhavel Finance Logo" className="w-12 h-12 mr-2" />
          <h2 className="text-3xl font-bold text-center text-gray-900">Kandhavel Finance</h2>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">{isRegistering ? 'Register' : step === 1 ? 'Login' : 'Additional Info'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering ? (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Name (alphabets only)
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => handleInputChange(e, setUsername)}
                  required
                  pattern="[A-Za-z\s]+"
                  title="Name should only contain alphabets"
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  DOB
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleInputChange(e, setEmail)}
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                  Aadhar Number (12 digits)
                </label>
                <input
                  type="text"
                  id="aadhar"
                  value={aadhar}
                  onChange={(e) => handleInputChange(e, setAadhar)}
                  required
                  pattern="\d{12}"
                  maxLength={12}
                  title="Aadhar number should be 12 digits"
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                  Pan Number (10 characters)
                </label>
                <input
                  type="text"
                  id="pan"
                  value={pan}
                  onChange={(e) => handleInputChange(e, setPan)}
                  required
                  pattern="[A-Z0-9]{10}"
                  maxLength={10}
                  title="PAN should be 10 characters alphanumeric"
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact Number (10 digits)
                </label>
                <input
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => handleInputChange(e, setContact)}
                  required
                  pattern="\d{10}"
                  maxLength={10}
                  title="Contact number should be 10 digits"
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password (minimum 8 characters)
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
                  required
                  minLength={8}
                  title="Password must be at least 8 characters long"
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
            </>
          ) : step === 1 ? (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-pink-500 hover:underline"
                >
                  New User? Register
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-pink-500 rounded hover:bg-pink-700 focus:outline-none focus:ring focus:ring-pink-300"
          >
            {isRegistering ? 'Register' : step === 1 ? 'Next' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;