import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Admin = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // Check if user is admin (corrected code)
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists() || !userDocSnap.data().isAdmin) {
          navigate('/');
          toast.error('Access denied: Admin only');
          return;
        }

        // Fetch loan applications
        const querySnapshot = await getDocs(collection(db, 'loanApplications'));
        const applications = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setLoanApplications(applications);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error loading applications');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [navigate]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'loanApplications', applicationId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      setLoanApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating application status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-blue-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Admin Dashboard</h1>
        
        <div className="grid gap-6">
          {loanApplications.map(application => (
            <div
              key={application.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {application.name}
                  </h2>
                  <p className="text-gray-600">
                    Application ID: {application.id}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {application.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Loan Type</p>
                  <p className="font-medium">{application.loanType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount</p>
                  <p className="font-medium">₹{application.loanAmount}</p>
                </div>
                <div>
                  <p className="text-gray-600">Contact</p>
                  <p className="font-medium">{application.contactNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Employment</p>
                  <p className="font-medium">{application.employmentType}</p>
                </div>
              </div>

              {application.documentUrl && (
                <div className="mb-4">
                  <a
                    href={application.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Documents
                  </a>
                </div>
              )}

              {application.status === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'approved')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'rejected')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;