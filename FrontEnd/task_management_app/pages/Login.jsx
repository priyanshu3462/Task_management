import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 
import { apiRequest } from './Api';

export const Login = () => {
   
  const[email, setEmail]= useState("");
  const[password, setPassword]= useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
        navigate("/Dashboard");
    } else {
        const errorData = await response.json();
        alert(errorData.error);
    }
};

  //   if (email === "you@gmail.com" && password === "password") {
    
  //     navigate("/Dashboard"); 
  //   } else {
  //     // Show an error message if credentials are incorrect
  //     alert("Invalid email or password");
  //   }
    
  // };
  const handleRegisterClick = () => {
    navigate("/Register"); // Navigate to the Register page
  };
  
  return (
        <div className="login-page">
      <div className="login-container">
     
        <div className="login-left">
          <p className="subtitle">Manage all your tasks in one place!</p>
          <h1 className="title">PS3462<br />Task Manager</h1>
          <div className="circle-gradient" />
        </div>

       
        <div className="login-form">
          <h2>Welcome back!</h2>
          <p className="form-subtitle">Keep all your credentials safe!</p>
          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" 
            onChange={(e)=> setEmail(e.target.value) }
            />

            <label>Password</label>
            <input type="password" placeholder="password"
             onChange={(e)=> setPassword(e.target.value) } />

            <div className="forgot-password">
              <a href="#">Forget Password?</a>
            </div>

            <button type="submit" >Log in</button>
          </form>
           <button 
            onClick={handleRegisterClick} 
            className="register-button"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

