// src/pages/Home.js
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="home">
      <h1>Welcome to your home page, {user.email}</h1>
      <p>This is a personalized home page for you.</p>
    </div>
  );
};

export default Home;
