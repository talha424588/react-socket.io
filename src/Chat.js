// src/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000', {
    auth: {
      token: localStorage.getItem('sanctum-token')
    }
  });
const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('sanctum-token');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8000/api/messages', {
                    params: {
                        group_id: "i2R5WNL55XaFYOX"
                      },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setChat(response.data);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };

        fetchMessages();

        socket.on('sendChatToClient', (message) => {
            setChat((prevChat) => [...prevChat, message]);
        });

        return () => {
            socket.off('sendChatToClient');
        };
    }, []);

    const sendMessage = async () => {
        if (message.trim()) {
            const messageData = {
                msg: message,
                user: JSON.parse(localStorage.getItem('userData')),
                replyId: null
            };

            const token = localStorage.getItem('sanctum-token');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                socket.emit('sendChatToServer', messageData);

                setChat((prevChat) => [...prevChat, messageData]);
                
                setMessage('');
                await axios.post('http://localhost:8000/api/messages', messageData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            } catch (error) {
                console.error('Failed to send message', error);
            }
        }
    };

    return (
        <div>
            <div
                ref={chatBoxRef}
                style={{
                    border: '1px solid #ccc',
                    height: '300px',
                    overflowY: 'scroll',
                    padding: '10px',
                    marginBottom: '10px'
                }}>
                {chat.map((msg, index) => (
                    <div key={index}>
                        {console.log(msg)}
                        <strong>{msg.user && msg.user.name ? msg.user.name : 'Unknown'}:</strong> {msg.msg}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                }}
                style={{ width: '80%', marginRight: '10px' }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
