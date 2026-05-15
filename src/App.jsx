import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Garage from './pages/Garage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CreateAd from './pages/CreateAd';
import EditAd from './pages/EditAd';
import AdDetails from './pages/AdDetails';
import Marketplace from './pages/Marketplace';
import UserProfile from './pages/UserProfile';
import MyAds from './pages/MyAds';
import MyMessages from './pages/MyMessages';
import Forum from './pages/Forum';
import TopicDetails from './pages/TopicDetails';
import MyTopics from './pages/MyTopics';
import AdminPanel from './pages/AdminPanel';

import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
        
        <Navbar />
        
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/ads/:id" element={<AdDetails />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<TopicDetails />} />

            <Route path="/garage" element={ <ProtectedRoute><Garage /></ProtectedRoute> } />
            <Route path="/create-ad" element={ <ProtectedRoute><CreateAd /></ProtectedRoute> } />
            <Route path="/edit-ad/:id" element={ <ProtectedRoute><EditAd /></ProtectedRoute> } />
            <Route path="/profile" element={ <ProtectedRoute><UserProfile /></ProtectedRoute> } />
            <Route path="/my-ads" element={ <ProtectedRoute><MyAds /></ProtectedRoute> } />
            <Route path="/my-messages" element={ <ProtectedRoute><MyMessages /></ProtectedRoute> } />
            <Route path="/my-topics" element={ <ProtectedRoute><MyTopics /></ProtectedRoute> } />
            <Route path="/admin" element={ <ProtectedRoute><AdminPanel /></ProtectedRoute> } />
            
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;