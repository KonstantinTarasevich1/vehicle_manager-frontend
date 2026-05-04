import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Chat = ({ adId, partnerUsername }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let client;

        const initializeChat = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const userResponse = await axios.get('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCurrentUser(userResponse.data.username);

                const historyResponse = await axios.get(`http://localhost:8080/api/chat/${adId}`);
                setMessages(historyResponse.data);

                client = new Client({
                    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                    reconnectDelay: 5000,
                    onConnect: () => {
                        console.log('Connected to Chat WS');
                        client.subscribe(`/topic/ad/${adId}`, (message) => {
                            const receivedMessage = JSON.parse(message.body);
                            setMessages((prev) => {
                                if (prev.some(msg => msg.id === receivedMessage.id)) {
                                    return prev;
                                }
                                return [...prev, receivedMessage];
                            });
                        });
                    },
                    onStompError: (frame) => {
                        console.error('Broker reported error: ' + frame.headers['message']);
                        console.error('Additional details: ' + frame.body);
                    },
                });

                client.activate();
                stompClientRef.current = client;

            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        };

        initializeChat();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [adId]);

    const sendMessage = (e) => {
        e.preventDefault();
        
        if (currentMessage.trim() && stompClientRef.current && currentUser) {
            const messageObject = {
                adId: adId,
                senderUsername: currentUser,
                recipientUsername: partnerUsername, 
                content: currentMessage
            };

            stompClientRef.current.publish({
                destination: `/app/chat/${adId}`,
                body: JSON.stringify(messageObject)
            });

            setCurrentMessage('');
        }
    };

    if (!currentUser) {
        return (
            <div className="bg-gray-50 p-6 rounded-lg text-center border mt-6">
                <p className="text-gray-600 font-semibold">You must be logged in to chat with the seller.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-sm border border-gray-200 mt-6 overflow-hidden">
            <div className="bg-blue-600 p-4 text-white font-bold">
                Chat with {partnerUsername}
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 my-auto">No messages yet. Say hello!</div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderUsername === currentUser;
                        return (
                            <div key={index} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                <span className="text-xs text-gray-500 mb-1 px-1">
                                    {isMe ? 'You' : msg.senderUsername}
                                </span>
                                <div className={`px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
                <input 
                    type="text" 
                    value={currentMessage} 
                    onChange={(e) => setCurrentMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    className="flex-1 border p-2 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    disabled={!currentMessage.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;