import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        if (window.confirm('Are you sure you want to delete this topic and all its comments?')) {
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

    if (loading) return <div className="text-center mt-10 text-xl">Loading your topics...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 mt-6">
            <button onClick={() => navigate('/profile')} className="text-blue-600 hover:underline font-semibold mb-4">
                &larr; Back to Profile
            </button>
            
            <h1 className="text-3xl font-bold mb-8">My Forum Topics</h1>

            <div className="space-y-4">
                {topics.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg border text-center text-gray-500 shadow-sm">
                        You haven't posted any topics yet.
                        <br />
                        <Link to="/forum" className="text-blue-600 font-bold hover:underline mt-2 inline-block">Go to Forum</Link>
                    </div>
                ) : (
                    topics.map(topic => (
                        <div key={topic.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <Link to={`/forum/${topic.id}`} className="text-xl font-bold text-blue-600 hover:underline mb-1 block">
                                    {topic.title}
                                </Link>
                                <div className="text-sm text-gray-500">
                                    <span> {topic.commentCount} comments</span>
                                    <span className="mx-2">•</span>
                                    <span> {new Date(topic.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleDelete(topic.id)}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded font-bold border border-red-200 hover:bg-red-600 hover:text-white transition whitespace-nowrap"
                            >
                                Delete Topic
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyTopics;