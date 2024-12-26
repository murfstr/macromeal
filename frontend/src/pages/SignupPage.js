// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { signupUser, setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await signupUser(email, password);
      setAuthToken(data.token, email);
      navigate('/homepage');
    } catch (error) {
      alert('Signup failed. Please try again.');
    }
  };
  
  return (
    <AuthCard
      title="Sign Up"
      footerText="Already have an account?"
      footerLink="/"
      footerLinkText="Login"
    >
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            placeholder="Enter email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Sign Up</button>
      </form>
    </AuthCard>
  );
}

export default SignupPage;
