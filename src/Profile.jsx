import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from './firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loanApplications, setLoanApplications] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/');
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);
          setIsAdmin(userData.isAdmin || false); // Set admin status
          if (userData.profilePictureUrl) {
            setProfilePicture(userData.profilePictureUrl);
          }
        }

        // Fetch loan applications
        const loansRef = collection(db, 'loanApplications');
        const q = query(loansRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const loans = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setLoanApplications(loans);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading profile data');
      } finally {
        setLoading(false);
        setLoadingLoans(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const user = auth.currentUser;
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user document with new profile picture URL
      await updateDoc(doc(db, 'users', user.uid), {
        profilePictureUrl: downloadURL
      });

      setProfilePicture(downloadURL);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleAdminPanelClick = () => {
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-500">Loading...</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">No user data found</div>
      </div>
    );
  }

  const renderLoanApplications = () => {
    if (loadingLoans) {
      return <div className="text-center py-4">Loading loan applications...</div>;
    }

    if (loanApplications.length === 0) {
      return <div className="text-center py-4">No loan applications found</div>;
    }

    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-500">Loan Applications</h3>
        <div className="space-y-4">
          {loanApplications.map((loan) => (
            <div key={loan.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  {loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)} Loan
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Application Date</p>
                  <p className="font-semibold">{new Date(loan.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Employment Type</p>
                  <p className="font-semibold">{loan.employmentType}</p>
                </div>
                {loan.documentUrl && (
                  <div>
                    <p className="text-gray-600">Documents</p>
                    <a 
                      href={loan.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Documents
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">My Profile</h2>
        
        {/* Add Admin Panel Button if user is admin */}
        {isAdmin && (
          <div className="max-w-md mx-auto mb-6">
            <button
              onClick={handleAdminPanelClick}
              className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Admin Panel
              </div>
            </button>
          </div>
        )}

        <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
          <div className="mb-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">
                    {userDetails.username?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={uploading}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-700"><strong>Email:</strong> {userDetails.email}</p>
            <p className="text-lg text-gray-700"><strong>Username:</strong> {userDetails.username}</p>
            <p className="text-lg text-gray-700"><strong>Age:</strong> {userDetails.age}</p>
            <p className="text-lg text-gray-700"><strong>Date of Birth:</strong> {userDetails.dob}</p>
            <p className="text-lg text-gray-700"><strong>Aadhar Number:</strong> {userDetails.aadhar}</p>
            <p className="text-lg text-gray-700"><strong>PAN Number:</strong> {userDetails.pan}</p>
            <p className="text-lg text-gray-700"><strong>Contact Number:</strong> {userDetails.contact}</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto">
          {renderLoanApplications()}
        </div>
      </div>
      <footer className="bg-blue-500 p-4 mt-6">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2023 Kandhavel Finance. All rights reserved.</p>
          <p>Contact us: info@kandhavelfinance.com</p>
          <p>Follow us on social media for the latest updates.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;