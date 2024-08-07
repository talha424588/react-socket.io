// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ setAuthToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        try {
            const response = await axios.post('https://dev.vmchat.org/api/login', {
                email,
                password,
            });

            const token = response.data.token;
            const userData = {
                access: response.data.access,
                chat_status: response.data.chat_status,
                code: response.data.code,
                email: response.data.email,
                email_status: 1,
                id: response.data.id,
                name: response.data.name,
                role: response.data.role,
                seen_privacy: response.data.seen_privacy,
                status: response.data.status,
                token: response.data.token,
                unique_id: response.data.unique_id,
                user_status: response.data.user_status
            };
              
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('sanctum-token', token);

            setAuthToken(token);
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
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
        </div>
    );
};

export default Login;
