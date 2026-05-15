import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import { MessageSquare, Inbox, ChevronRight, Loader2, MailOpen } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading your Inbox...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3 tracking-tight">
                <Inbox className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                My Messages
            </h1>
            
            <div className="flex flex-col md:flex-row gap-6 h-[600px] lg:h-[700px]">
                <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col overflow-hidden transition-colors">
                    <div className="p-5 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <MailOpen className="w-5 h-5 text-gray-500" /> Recent Conversations
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-gray-400 dark:text-gray-500 text-center">
                                <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                                <p>Your inbox is empty.</p>
                            </div>
                        ) : (
                            conversations.map((conv, idx) => {
                                const isActive = activeChat?.adId === conv.adId && activeChat?.partner === conv.partner;
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleSelectChat(conv)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600 dark:border-l-blue-400' : 'border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900 dark:text-white truncate pr-2">{conv.partner}</span>
                                                {conv.unreadCount > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex-shrink-0">
                                                        {conv.unreadCount} new
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {conv.lastMessage.senderUsername === currentUser ? 'You: ' : ''}
                                                {conv.lastMessage.content}
                                            </div>
                                            <div className="text-[11px] font-medium text-blue-500 dark:text-blue-400 mt-1.5 uppercase tracking-wide">
                                                Ad #{conv.adId}
                                            </div>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-300 dark:text-gray-600'}`} />
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 h-full flex flex-col">
                    {activeChat ? (
                        <div className="h-full -mt-8"> 
                            <Chat adId={activeChat.adId} partnerUsername={activeChat.partner} />
                        </div>
                    ) : (
                        <div className="h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 transition-colors p-6 text-center">
                            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-full mb-6">
                                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No conversation selected</h3>
                            <p className="max-w-xs">Select a conversation from the sidebar menu to view your messages and start chatting.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MyMessages;