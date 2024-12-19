import React, { useState } from 'react';
import { loginUser, setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      setAuthToken(data.token);
      navigate('/homepage');
    } catch (error) {
      alert('Invalid credentials');
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e)=>setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" value={password}
               onChange={(e)=>setPassword(e.target.value)}/>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default LoginPage;
