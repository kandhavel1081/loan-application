import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    panCard: '',
    aadhar: '',
    employmentType: '',
    monthlyIncome: '',
    monthlyTurnover: '',
    loanType: '',
    loanAmount: '',
    documentUrl: '',
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (!user) {
            console.log('No user logged in');
            toast.error('Please sign in to apply for a loan');
            navigate('/login');
          } else {
            console.log('User logged in:', user.uid);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error('Authentication error');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      
      if (!user) {
        toast.error('Please sign in to submit a loan application');
        navigate('/login');
        return;
      }

      const requiredFields = ['name', 'contactNumber', 'panCard', 'aadhar', 'employmentType', 'loanType', 'loanAmount'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      const loanData = {
        userId: user.uid,
        userEmail: user.email,
        name: formData.name.trim(),
        contactNumber: formData.contactNumber.trim(),
        panCard: formData.panCard.trim(),
        aadhar: formData.aadhar.trim(),
        employmentType: formData.employmentType,
        monthlyIncome: formData.employmentType === 'salaried' ? Number(formData.monthlyIncome) || 0 : null,
        monthlyTurnover: formData.employmentType === 'selfEmployed' ? Number(formData.monthlyTurnover) || 0 : null,
        loanType: formData.loanType,
        loanAmount: Number(formData.loanAmount) || 0,
        documentUrl: formData.documentUrl.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const loanApplicationsRef = collection(db, 'loanApplications');
      const docRef = await addDoc(loanApplicationsRef, loanData);
      console.log('Document written with ID:', docRef.id);

      setSubmittedData({
        ...loanData,
        id: docRef.id
      });

      toast.success('Loan application submitted successfully!');

      setFormData({
        name: '',
        contactNumber: '',
        panCard: '',
        aadhar: '',
        employmentType: '',
        monthlyIncome: '',
        monthlyTurnover: '',
        loanType: '',
        loanAmount: '',
        documentUrl: '',
      });

    } catch (error) {
      console.error('Error details:', error);
      toast.error(error.message || 'Error submitting loan application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Apply for Loan</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              pattern="[A-Za-z\s]+"
              title="Name should only contain alphabets"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              pattern="\d+"
              title="Contact number should only contain numbers"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">PAN Card Number</label>
            <input
              type="text"
              name="panCard"
              value={formData.panCard}
              onChange={handleChange}
              pattern="[A-Za-z0-9]+"
              title="PAN card number should contain only alphabets and numbers"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Aadhar Number</label>
            <input
              type="text"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              pattern="\d{12}"
              title="Aadhar number should be a 12-digit number"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select</option>
              <option value="salaried">Salaried</option>
              <option value="selfEmployed">Self Employed</option>
            </select>
          </div>
          {formData.employmentType === 'salaried' && (
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Monthly Income</label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
          )}
          {formData.employmentType === 'selfEmployed' && (
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">Monthly Turnover</label>
              <input
                type="number"
                name="monthlyTurnover"
                value={formData.monthlyTurnover}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Loan Type</label>
            <select
              name="loanType"
              value={formData.loanType}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            >
              <option value="">Select</option>
              <option value="home">Home Loan</option>
              <option value="vehicle">Vehicle Loan</option>
              <option value="personal">Personal Loan</option>
              <option value="education">Education Loan</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Document URL</label>
            <input
              type="url"
              name="documentUrl"
              value={formData.documentUrl}
              onChange={handleChange}
              placeholder="Salary slip or Bank statement Url"
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <p className="mt-1 text-sm text-gray-500">
              Please provide a link to salary slip or upload bank statement (via Google Drive, Dropbox, etc.)
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700">Enter Loan Amount</label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        {submittedData && (
          <div className="mt-12 bg-white p-8 rounded shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-blue-500">Submitted Loan Details</h3>
            <div className="space-y-2">
              <p className="text-lg text-gray-700"><strong>Application ID:</strong> {submittedData.id}</p>
              <p className="text-lg text-gray-700"><strong>Name:</strong> {submittedData.name}</p>
              <p className="text-lg text-gray-700"><strong>Contact Number:</strong> {submittedData.contactNumber}</p>
              <p className="text-lg text-gray-700"><strong>PAN Card Number:</strong> {submittedData.panCard}</p>
              <p className="text-lg text-gray-700"><strong>Aadhar Number:</strong> {submittedData.aadhar}</p>
              <p className="text-lg text-gray-700"><strong>Employment Type:</strong> {submittedData.employmentType}</p>
              {submittedData.employmentType === 'salaried' && (
                <p className="text-lg text-gray-700"><strong>Monthly Income:</strong> {submittedData.monthlyIncome}</p>
              )}
              {submittedData.employmentType === 'selfEmployed' && (
                <p className="text-lg text-gray-700"><strong>Monthly Turnover:</strong> {submittedData.monthlyTurnover}</p>
              )}
              <p className="text-lg text-gray-700"><strong>Loan Type:</strong> {submittedData.loanType}</p>
              <p className="text-lg text-gray-700"><strong>Loan Amount:</strong> {submittedData.loanAmount}</p>
              {submittedData.documentUrl && (
                <p className="text-lg text-gray-700">
                  <strong>Document:</strong>{' '}
                  <a 
                    href={submittedData.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                </p>
              )}
              <p className="text-lg text-gray-700"><strong>Status:</strong> {submittedData.status}</p>
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

export default ApplyLoan;