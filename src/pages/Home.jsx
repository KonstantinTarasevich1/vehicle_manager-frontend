import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-16 text-center transition-colors">
        Welcome to AutoManager
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        
        <Link 
          to="/marketplace" 
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium py-12 rounded-xl shadow-md transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
        >
          Marketplace
        </Link>

        <Link 
          to="/forum" 
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium py-12 rounded-xl shadow-md transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
        >
          Forum
        </Link>

        <Link 
          to="/garage" 
          className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-medium py-12 rounded-xl shadow-md transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center text-center"
        >
          My Garage
        </Link>

      </div>
    </div>
  );
}