// src/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const chatBoxRef = useRef(null);

    const user = {
        id: 'user123',
        name: 'John Doe',
        avatar: 'https://example.com/avatar.jpg'
    };

    useEffect(() => {
        socket.on('sendChatToClient', (message) => {
            setChat((prevChat) => [...prevChat, message]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off('sendChatToClient');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const messageData = {
                message: message,
                user: user,
                replyId: null
            };

            socket.emit('sendChatToServer', messageData);
            setChat((prevChat) => [...prevChat, messageData]);
            setMessage('');
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
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
                        <strong>{msg.user.name}:</strong> {msg.message}
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
