import { Link } from 'react-router-dom';
import { CarFront, Store, MessageCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors">
      
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-800 text-white py-20 px-4 text-center shadow-md">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-sm">
          Welcome to AutoManager
        </h1>
        <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 text-blue-100 drop-shadow-sm">
          The all-in-one platform to manage your personal garage, trade vehicles in the marketplace, and connect with auto enthusiasts.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-105">
            Join the Community
          </Link>
          <Link to="/marketplace" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-all">
            Browse Vehicles
          </Link>
        </div>
      </div>
      
      <div className="max-w-6xl w-full mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Our Features</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Everything you need in one powerful application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <Link to="/marketplace" className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-xl group">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <Store className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Marketplace</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Buy and sell vehicles with ease. Browse thousands of active listings or post your own ad in minutes.
            </p>
            <span className="mt-auto text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Visit Marketplace <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link to="/forum" className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-xl group">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Auto Forum</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join the discussion. Ask for advice, share your car builds, and connect with other members of the community.
            </p>
            <span className="mt-auto text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Join Discussions <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link to="/garage" className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col items-center text-center transition-all hover:-translate-y-2 hover:shadow-xl group">
            <div className="bg-green-100 dark:bg-green-900/30 p-5 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <CarFront className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">My Garage</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Keep track of your personal vehicles. Manage technical details, specifications, and history in a secure virtual garage.
            </p>
            <span className="mt-auto text-green-600 dark:text-green-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
              Open Garage <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}