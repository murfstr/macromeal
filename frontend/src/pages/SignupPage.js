import React, { useState } from 'react';
import { signupUser, setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await signupUser(email, password);
      setAuthToken(data.token);
      navigate('/mealplans');
    } catch (error) {
      alert('Error signing up');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password}
               onChange={(e)=>setPassword(e.target.value)}/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
