import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicle1 from './assets/vehicle1.jpg';
import vehicle2 from './assets/vehicle2.jpg';
import vehicle3 from './assets/vehicle3.jpg';
import { auth, db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

const BuySellInsurance = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState(null);
  const [vehicleType, setVehicleType] = useState('');
  const [formData, setFormData] = useState({
    registrationNumber: '',
    mobileNumber: '',
    name: '',
    email: '',
    pincode: '',
    imageUrl: '', // Changed from image to imageUrl
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formType === 'buy') {
      fetchAvailableVehicles();
    }
  }, [formType]);

  const fetchAvailableVehicles = async () => {
    setLoading(true);
    try {
      const vehiclesRef = collection(db, 'vehicles');
      const snapshot = await getDocs(vehiclesRef);
      const vehicles = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(vehicle => vehicle.status === 'available');
      setAvailableVehicles(vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Error loading available vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyVehicleClick = () => {
    setFormType('buy');
  };

  const handleSellVehicleClick = () => {
    setFormType('sell');
  };

  const handleInsuranceClick = () => {
    setFormType('insurance');
  };

  const handleVehicleTypeChange = (e) => {
    setVehicleType(e.target.value);
  };

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
        toast.error('You must be logged in to sell a vehicle');
        return;
      }

      // Create vehicle data object
      const vehicleData = {
        userId: user.uid,
        vehicleType,
        registrationNumber: formData.registrationNumber,
        mobileNumber: formData.mobileNumber,
        name: formData.name,
        email: formData.email,
        pincode: formData.pincode,
        imageUrl: formData.imageUrl,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);

      setSubmittedData({
        ...vehicleData,
        id: docRef.id
      });

      toast.success('Vehicle details submitted successfully!');

      // Reset form
      setFormData({
        registrationNumber: '',
        mobileNumber: '',
        name: '',
        email: '',
        pincode: '',
        imageUrl: '',
      });
      setVehicleType('');

    } catch (error) {
      console.error('Error submitting vehicle data:', error);
      toast.error('Error submitting vehicle data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = (vehicle) => {
    // Open email client with seller's email
    window.location.href = `mailto:${vehicle.email}?subject=Interested%20in%20${vehicle.vehicleType}%20-%20${vehicle.registrationNumber}&body=Hi%20${vehicle.name},%0D%0A%0D%0AI%20am%20interested%20in%20your%20vehicle%20(${vehicle.registrationNumber}).%20Please%20contact%20me%20to%20discuss%20further.`;
  };

  const renderBuySection = () => (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4 text-center text-blue-500">Available Vehicles</h3>
      {loading ? (
        <div className="text-center py-8">
          <div className="text-xl text-gray-600">Loading vehicles...</div>
        </div>
      ) : availableVehicles.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-xl text-gray-600">No vehicles available for sale</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative pb-[60%]">
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.vehicleType} - ${vehicle.registrationNumber}`}
                  className="absolute h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {vehicle.vehicleType.toUpperCase()} - {vehicle.registrationNumber}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-semibold">Seller:</span> {vehicle.name}</p>
                  <p><span className="font-semibold">Location:</span> {vehicle.pincode}</p>
                  <p><span className="font-semibold">Contact:</span> {vehicle.mobileNumber}</p>
                  <p><span className="font-semibold">Email:</span> {vehicle.email}</p>
                </div>
                <button
                  onClick={() => handleBuyNow(vehicle)}
                  className="mt-4 w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                >
                  Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="container mx-auto flex-grow p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Buy or Sell Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleBuyVehicleClick} className="text-black hover:underline text-2xl font-semibold">Buy a Vehicle</a>
          </div>
          <div className="p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleSellVehicleClick} className="text-black hover:underline text-2xl font-semibold">Sell a Vehicle</a>
          </div>
          <div className="p-16 bg-white rounded shadow-md hover:shadow-lg transition-shadow">
            <a href="#" onClick={handleInsuranceClick} className="text-black hover:underline text-2xl font-semibold">Buy Insurance</a>
          </div>
        </div>
        {formType === 'buy' && renderBuySection()}
        {formType === 'sell' && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-500">Sell a Vehicle</h3>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={vehicleType}
                  onChange={handleVehicleTypeChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">Select</option>
                  <option value="car">Car</option>
                  <option value="bike">Bike</option>
                  <option value="bus">Bus</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Registration Number</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL"
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
              <div className="mt-12 text-center">
                <h3 className="text-2xl font-bold mb-4 text-blue-500">Vehicle Details</h3>
                {submittedData.imageUrl && (
                  <img
                    src={submittedData.imageUrl}
                    alt="Vehicle"
                    className="w-full h-64 object-cover rounded-lg mx-auto"
                  />
                )}
                <p className="mt-4 text-xl font-semibold text-gray-800">Vehicle Type: {submittedData.vehicleType}</p>
                <p className="mt-2 text-lg text-gray-700">Registration Number: {submittedData.registrationNumber}</p>
                <p className="mt-2 text-lg text-gray-700">Mobile Number: {submittedData.mobileNumber}</p>
                <p className="mt-2 text-lg text-gray-700">Name: {submittedData.name}</p>
                <p className="mt-2 text-lg text-gray-700">Email: {submittedData.email}</p>
                <p className="mt-2 text-lg text-gray-700">Pincode: {submittedData.pincode}</p>
              </div>
            )}
          </div>
        )}
        {formType === 'insurance' && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-4 text-center text-blue-500">Buy Insurance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example insurance cards */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img src="https://via.placeholder.com/300" alt="Insurance 1" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Insurance 1</h3>
                <p className="text-gray-700 mb-4">Description of Insurance 1</p>
                <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
                  Buy Now
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img src="https://via.placeholder.com/300" alt="Insurance 2" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Insurance 2</h3>
                <p className="text-gray-700 mb-4">Description of Insurance 2</p>
                <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
                  Buy Now
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <img src="https://via.placeholder.com/300" alt="Insurance 3" className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Insurance 3</h3>
                <p className="text-gray-700 mb-4">Description of Insurance 3</p>
                <button className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200">
                  Buy Now
                </button>
              </div>
              {/* Add more insurance cards as needed */}
            </div>
          </div>
        )}
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

export default BuySellInsurance;