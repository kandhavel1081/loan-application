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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
                  Name
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  id="aadhar"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                  Pan Number
                </label>
                <input
                  type="text"
                  id="pan"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
                />
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
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