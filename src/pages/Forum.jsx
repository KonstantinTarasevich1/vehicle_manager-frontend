import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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

    if (loading) return <div className="text-center mt-10 text-xl">Loading forum...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 mt-6">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">Auto Forum</h1>

            <div className="mb-8">
                <input 
                    type="text" 
                    placeholder="🔍 Search topics or authors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 p-4 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-lg"
                />
            </div>

            {isLoggedIn ? (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                    <h2 className="text-xl font-bold mb-4">Start a new discussion</h2>
                    <form onSubmit={handleCreateTopic} className="space-y-4">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Topic Title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                        <div>
                            <textarea 
                                placeholder="What's on your mind?" 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)} 
                                className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
                                required 
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">
                            Post Topic
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-8 text-blue-800">
                    <Link to="/login" className="font-bold underline">Log in</Link> to join the discussion and post new topics.
                </div>
            )}

            <div className="space-y-4">
                {filteredTopics.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-white rounded border">No topics found matching your search.</p>
                ) : (
                    filteredTopics.map(topic => (
                        <Link to={`/forum/${topic.id}`} key={topic.id} className="block bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 hover:shadow-md transition">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{topic.title}</h3>
                            <div className="text-sm text-gray-500 flex gap-4">
                                <span> {topic.authorUsername}</span>
                                <span> {topic.commentCount} comments</span>
                                <span> {new Date(topic.createdAt).toLocaleString()}</span>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Forum;