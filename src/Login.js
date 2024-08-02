// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuthToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });

            // Store the token in localStorage
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            setAuthToken(token);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={login}>Login</button>
        </div>
    );
};

export default Login;
