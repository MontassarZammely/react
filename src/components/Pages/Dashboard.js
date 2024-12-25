// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {userData.name}</h1>
      {/* Display more user data here */}
    </div>
  );
};

export default Dashboard;
