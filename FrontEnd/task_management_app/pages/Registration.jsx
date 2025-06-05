import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'; 
import { apiRequest } from './Api';


export const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await apiRequest('/register', 'POST', { email, password });
      if (response && response.message) {
        alert("Registration successful!");
        setTimeout(() => {
          navigate("/login");
        }, 100);
      } else if (response && response.error) {
        alert("Registration failed: " + response.error);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <p className="subtitle">Join us and manage your tasks efficiently!</p>
          <h1 className="title">Cloud-based<br />Task Manager</h1>
          <div className="circle-gradient" />
        </div>

        <div className="register-form">
          <h2>Create an Account</h2>
          <p className="form-subtitle">Fill in the details below!</p>
          <form onSubmit={handleSubmit} className="form-container">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />

            <label>Password</label>
            <input 
              type="password" 
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)} 
              required
            />

            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
            />

           <button
             type="submit"
            //  onClick={() => apiRequest('/register', 'POST', { email, password })}
             className="register-button"
           >
             Register
           </button>

          </form>

          <div className="login-redirect">
            <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};
