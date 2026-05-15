import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Send, MessageCircle, Lock } from 'lucide-react';

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
            <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl text-center border border-gray-200 dark:border-gray-700 mt-8 flex flex-col items-center justify-center transition-colors">
                <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-full mb-4">
                    <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Want to contact the seller?</h3>
                <p className="text-gray-600 dark:text-gray-400">You must be logged in to send messages and chat with <span className="font-bold">{partnerUsername}</span>.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[550px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8 overflow-hidden transition-colors">
            
            <div className="bg-blue-600 dark:bg-blue-700 p-4 px-6 text-white font-bold flex items-center gap-3 shadow-sm z-10">
                <MessageCircle className="w-6 h-6 text-blue-100" />
                <span className="text-lg tracking-wide">Chat with {partnerUsername}</span>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex flex-col gap-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
                        <p className="font-medium">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderUsername === currentUser;
                        return (
                            <div key={index} className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1 px-1 uppercase tracking-wider">
                                    {isMe ? 'You' : msg.senderUsername}
                                </span>
                                <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'}`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1 font-medium">
                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-3 items-center">
                <input 
                    type="text" 
                    value={currentMessage} 
                    onChange={(e) => setCurrentMessage(e.target.value)} 
                    placeholder="Type your message..." 
                    className="flex-1 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3.5 rounded-full px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                    type="submit" 
                    disabled={!currentMessage.trim()}
                    className="bg-blue-600 text-white p-3.5 rounded-full font-bold hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center group"
                >
                    <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </form>
        </div>
    );
};

export default Chat;