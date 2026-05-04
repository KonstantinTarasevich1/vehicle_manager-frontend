import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';

const MyMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const userRes = await axios.get('http://localhost:8080/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const myUsername = userRes.data.username;
            setCurrentUser(myUsername);

            const msgsRes = await axios.get('http://localhost:8080/api/chat/my-messages', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const grouped = {};
            msgsRes.data.forEach(msg => {
                const partner = msg.senderUsername === myUsername ? msg.recipientUsername : msg.senderUsername;
                const key = `${msg.adId}_${partner}`;

                if (!grouped[key]) {
                    grouped[key] = {
                        adId: msg.adId,
                        partner: partner,
                        messages: [],
                        unreadCount: 0,
                        lastMessage: null
                    };
                }

                grouped[key].messages.push(msg);
                
                if (msg.recipientUsername === myUsername && !msg.readStatus) {
                    grouped[key].unreadCount += 1;
                }
            });

            const convosArray = Object.values(grouped).map(conv => {
                conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                conv.lastMessage = conv.messages[conv.messages.length - 1];
                return conv;
            }).sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

            setConversations(convosArray);
        } catch (err) {
            console.error('Failed to load messages', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChat = async (conv) => {
        setActiveChat(conv);
        
        if (conv.unreadCount > 0) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:8080/api/chat/mark-read/${conv.adId}/${conv.partner}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setConversations(prev => prev.map(c => 
                    c.adId === conv.adId && c.partner === conv.partner 
                        ? { ...c, unreadCount: 0 } 
                        : c
                ));
            } catch (err) {
                console.error('Failed to mark read', err);
            }
        }
    };

    if (loading) return <div className="text-center p-10 text-xl">Loading your Inbox...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 mt-6">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>
            
            <div className="flex flex-col md:flex-row gap-6 h-[600px]">
                
                <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">Recent Conversations</div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-gray-500 text-center mt-10">Your inbox is empty.</div>
                        ) : (
                            conversations.map((conv, idx) => {
                                const isActive = activeChat?.adId === conv.adId && activeChat?.partner === conv.partner;
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleSelectChat(conv)}
                                        className={`p-4 border-b cursor-pointer transition-colors hover:bg-blue-50 ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-800">{conv.partner}</span>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                    {conv.unreadCount} new
                                                </span>
                                            )}
                                        </div>
                                        <div className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                                            {conv.lastMessage.senderUsername === currentUser ? 'You: ' : ''}
                                            {conv.lastMessage.content}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2">
                                            Regarding Ad #{conv.adId}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3">
                    {activeChat ? (
                        <div className="h-full mt-[-24px]"> 
                            <Chat adId={activeChat.adId} partnerUsername={activeChat.partner} />
                        </div>
                    ) : (
                        <div className="h-full bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col items-center justify-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-lg">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MyMessages;