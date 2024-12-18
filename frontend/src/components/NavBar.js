import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

function NavBar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logoutUser(); // clears token and email from localStorage
    navigate('/login'); // redirect to login page after logout
  };

  return (
    <nav style={{ background: '#f0f0f0', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
      <Link to="/mealplans" style={{ margin: '0 10px' }}>Meal Plans</Link>
      <Link to="/profile" style={{ margin: '0 10px' }}>Profile</Link>
      <Link to="/recipes" style={{ margin: '0 10px' }}>Recipes</Link>
      <button onClick={handleLogout} style={{ margin: '0 10px' }}>Logout</button>
    </nav>
  );
}

export default NavBar;
