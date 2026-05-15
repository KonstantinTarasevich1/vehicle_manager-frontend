import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MessageSquare, Clock, Trash2, Loader2, MessageCircle, ArrowRight } from 'lucide-react';

const MyTopics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyTopics();
    }, []);

    const fetchMyTopics = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/forum/topics/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTopics(response.data);
        } catch (error) {
            console.error('Error fetching my topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (topicId) => {
        if (window.confirm('Are you sure you want to delete this topic and all its comments? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/forum/topics/${topicId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTopics(topics.filter(t => t.id !== topicId));
            } catch (error) {
                console.error('Error deleting topic:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading your topics...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
            <button onClick={() => navigate('/profile')} className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Profile
            </button>
            
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3 tracking-tight">
                <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                My Forum Topics
            </h1>

            <div className="space-y-5">
                {topics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center px-4 transition-colors">
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-full mb-6">
                            <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No topics found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                            You haven't posted any topics yet. Start a discussion and engage with the community!
                        </p>
                        <Link 
                            to="/forum" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 group"
                        >
                            Go to Forum <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    topics.map(topic => (
                        <div key={topic.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all group">
                            
                            <div className="flex-1 min-w-0">
                                <Link to={`/forum/${topic.id}`} className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 block truncate">
                                    {topic.title}
                                </Link>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare className="w-4 h-4 text-purple-500" />
                                        <span>{topic.commentCount} {topic.commentCount === 1 ? 'comment' : 'comments'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-green-500" />
                                        <span>{new Date(topic.createdAt).toLocaleDateString()} at {new Date(topic.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleDelete(topic.id)}
                                className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white px-5 py-2.5 rounded-xl font-bold border border-red-100 dark:border-red-800/50 hover:border-transparent transition-all w-full md:w-auto shrink-0"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Topic
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyTopics;