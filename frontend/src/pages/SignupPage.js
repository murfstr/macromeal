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
      navigate('/');
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

// export const signIn = async (email, password) => {
//   let response = await api.post("users/login/", {
//       email: email,
//       password: password,
//   });
//   if (response.status === 200) {
//       let { user, token } = response.data;
//       localStorage.setItem("token", token);
//       api.defaults.headers.common["Authorization"] = `Token ${token}`;
//       return user;
//   }
//   alert("credentials failed");
//   return null;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         if (isSignUp) {
//             setUser(await signUp(email, password));
//         } else {
//             setUser(await signIn(email, password));
//         }
//     } catch (error) {
//         console.error(isSignUp ? "Sign-up failed" : "Sign-in failed", error);
//     }
// };