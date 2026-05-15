import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MessageSquare, User, Clock, PlusCircle, Lock, Edit3, Loader2, MessageSquareOff } from 'lucide-react';

const Forum = () => {
    const [topics, setTopics] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/forum/topics');
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/forum/topics', 
                { title, content },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setTitle('');
            setContent('');
            fetchTopics(); 
        } catch (error) {
            console.error('Error creating topic:', error);
        }
    };

    const filteredTopics = topics.filter(topic => 
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        topic.authorUsername.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading discussions...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        Auto Forum
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Join the community, ask questions, and share your automotive passion.</p>
                </div>
            </div>

            <div className="mb-10 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-6 w-6 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search topics or authors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm text-lg transition-all"
                />
            </div>

            {isLoggedIn ? (
                <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                        <Edit3 className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Start a new discussion
                    </h2>
                    
                    <form onSubmit={handleCreateTopic} className="space-y-5">
                        <div>
                            <input 
                                type="text" 
                                placeholder="What is this discussion about? (Topic Title)" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium" 
                                required 
                            />
                        </div>
                        <div>
                            <textarea 
                                placeholder="Share your thoughts, ask a question, or start a debate..." 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)} 
                                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-3.5 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" 
                                required 
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group">
                                <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                Post Topic
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-10 text-center flex flex-col items-center justify-center transition-colors">
                    <div className="bg-blue-100 dark:bg-blue-800/50 p-4 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Want to join the conversation?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                        You need an account to create new topics and reply to discussions.
                    </p>
                    <Link to="/login" className="bg-blue-600 text-white font-bold py-2.5 px-8 rounded-xl shadow hover:bg-blue-700 transition-colors">
                        Log In to Participate
                    </Link>
                </div>
            )}

            <div className="space-y-5">
                {filteredTopics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-center px-4 transition-colors">
                        <MessageSquareOff className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No topics found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? "We couldn't find any topics matching your search." : "It's quiet here. Be the first to start a discussion!"}
                        </p>
                    </div>
                ) : (
                    filteredTopics.map(topic => (
                        <Link 
                            to={`/forum/${topic.id}`} 
                            key={topic.id} 
                            className="block bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:-translate-y-1 group"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {topic.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 dark:text-gray-400 font-medium border-t border-gray-50 dark:border-gray-700/50 pt-4 mt-2">
                                <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span>{topic.authorUsername}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-purple-500" />
                                    <span>{topic.commentCount} {topic.commentCount === 1 ? 'comment' : 'comments'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span>{new Date(topic.createdAt).toLocaleDateString()} at {new Date(topic.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Forum;