import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';  // Import the CSS file for styling

const socket = io('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('sanctum-token')
    }
});

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const chatBoxRef = useRef(null);
    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const fetchMessages = async (page) => {
            const token = localStorage.getItem('sanctum-token');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            setLoading(true);

            try {
                const response = await axios.get('https://dev.vmchat.org/api/messages', {
                    params: {
                        groupId: "i2R5WNL55XaFYOX",
                        page: page,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setChat((prevChat) => [...response.data.data.reverse(), ...prevChat]);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages(page);

        socket.on('sendChatToClient', (message) => {
            setChat((prevChat) => [...prevChat, message]);
        });

        return () => {
            socket.off('sendChatToClient');
        };
    }, [page]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chat]);

    const handleScroll = async () => {
        if (chatBoxRef.current.scrollTop === 0 && !loadingMore) {
            setLoadingMore(true);
            setPage((prevPage) => prevPage + 1);
            setLoadingMore(false);
        }
    };

    const sendMessage = async () => {
        if (message.trim()) {
            const messageData = {
                msg: message,
                user: userData,
                replyId: null
            };

            const token = localStorage.getItem('sanctum-token');
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                if(socket.connected)
                {
                    socket.emit('sendChatToServer', messageData);
                    setChat((prevChat) => [...prevChat, messageData]);

                }
                else
                    alert("socket disconnected");

                setMessage('');
                await axios.post('https://dev.vmchat.org/api/messages', messageData, {
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
        <div className="chat-container">
            <div
                ref={chatBoxRef}
                onScroll={handleScroll}
                className="chat-box"
            >
                {loading && <div className="loading"></div>}
                {chat.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`chat-message ${msg.user && msg.user.name === userData.name ? 'my-message' : 'other-message'}`}
                    >
                        <strong>{msg.user && msg.user.name ? msg.user.name : 'Unknown'}:</strong> {msg.msg}
                    </div>
                ))}
                {loadingMore && <div className="loading-more">Loading more...</div>}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    className="message-input"
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default Chat;
