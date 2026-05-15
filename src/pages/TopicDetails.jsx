import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Clock, Trash2, MessageSquare, Send, Lock, Loader2 } from 'lucide-react';

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
        if (window.confirm("Are you sure you want to delete this ENTIRE topic? This action cannot be undone.")) {
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
        if (window.confirm("Are you sure you want to delete this comment?")) {
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

    if (!topic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                <p className="text-lg font-medium">Loading discussion...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen">
            <button onClick={() => navigate('/forum')} className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Forum
            </button>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-10 relative overflow-hidden transition-colors">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                        {topic.title}
                    </h1>
                    {canDelete(topic.authorUsername) && (
                        <button 
                            onClick={handleDeleteTopic} 
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex-shrink-0"
                        >
                            <Trash2 className="w-4 h-4" /> Delete Topic
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg">
                        <User className="w-4 h-4" />
                        <span>{topic.authorUsername}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(topic.createdAt).toLocaleDateString()} at {new Date(topic.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>

                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-lg leading-relaxed">
                    {topic.content}
                </p>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                    <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    Comments ({comments.length})
                </h2>
                
                <div className="space-y-5">
                    {comments.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800/60 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white block">{comment.authorUsername}</span>
                                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {canDelete(comment.authorUsername) && (
                                        <button 
                                            onClick={() => handleDeleteComment(comment.id)} 
                                            className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                            title="Delete Comment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap pl-11">
                                    {comment.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {currentUser ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Leave a Reply</h3>
                    <form onSubmit={handleAddComment}>
                        <textarea 
                            placeholder="Write your comment here..." 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white p-4 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4 transition-all resize-none" 
                            required 
                        />
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                <Send className="w-4 h-4" /> Post Comment
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-2xl border border-blue-100 dark:border-blue-800/50 text-center flex flex-col items-center justify-center transition-colors mt-8">
                    <div className="bg-blue-100 dark:bg-blue-800/50 p-4 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Join the conversation</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You need to be logged in to leave a reply.
                    </p>
                    <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-xl shadow transition-colors">
                        Log In to Reply
                    </Link>
                </div>
            )}
        </div>
    );
};

export default TopicDetails;