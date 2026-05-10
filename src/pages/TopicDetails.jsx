import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TopicDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchTopicAndComments();
        fetchCurrentUser();
    }, [id]);

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:8080/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error("Failed to load user info");
            }
        }
    };

    const fetchTopicAndComments = async () => {
        try {
            const topicRes = await axios.get(`http://localhost:8080/api/forum/topics/${id}`);
            setTopic(topicRes.data);
            
            const commentsRes = await axios.get(`http://localhost:8080/api/forum/topics/${id}/comments`);
            setComments(commentsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:8080/api/forum/topics/${id}/comments`, 
                { content: newComment },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setNewComment('');
            fetchTopicAndComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleDeleteTopic = async () => {
        if (window.confirm("Are you sure you want to delete this ENTIRE topic?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/forum/topics/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                navigate('/forum');
            } catch (error) {
                console.error('Error deleting topic:', error);
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Delete this comment?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/forum/comments/${commentId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                fetchTopicAndComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const canDelete = (authorUsername) => {
        if (!currentUser) return false;
        if (currentUser.username === authorUsername) return true;
        if (currentUser.role === 'MODERATOR' || currentUser.role === 'ADMIN') return true;
        return false;
    };

    if (!topic) return <div className="text-center mt-10">Loading topic...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 mt-6">
            <button onClick={() => navigate('/forum')} className="text-blue-600 hover:underline font-semibold mb-4">
                &larr; Back to Forum
            </button>

            {/* ТЕМАТА */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
                    {canDelete(topic.authorUsername) && (
                        <button onClick={handleDeleteTopic} className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm font-bold border border-red-200 transition">
                            Delete Topic
                        </button>
                    )}
                </div>
                <div className="text-sm text-gray-500 mb-6 border-b pb-4">
                    Posted by <span className="font-bold">{topic.authorUsername}</span> on {new Date(topic.createdAt).toLocaleString()}
                </div>
                <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">{topic.content}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
            <div className="space-y-4 mb-8">
                {comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 font-semibold">{comment.authorUsername} <span className="text-xs font-normal text-gray-400">• {new Date(comment.createdAt).toLocaleString()}</span></span>
                            {canDelete(comment.authorUsername) && (
                                <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 hover:underline text-xs font-bold">
                                    Delete
                                </button>
                            )}
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                ))}
            </div>

            {currentUser ? (
                <form onSubmit={handleAddComment} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <textarea 
                        placeholder="Write a comment..." 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none mb-2" 
                        required 
                    />
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition">
                        Post Comment
                    </button>
                </form>
            ) : (
                <div className="bg-blue-50 p-4 rounded border text-blue-800">
                    <Link to="/login" className="font-bold underline">Log in</Link> to post a comment.
                </div>
            )}
        </div>
    );
};

export default TopicDetails;