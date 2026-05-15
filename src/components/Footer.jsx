import { Link } from 'react-router-dom';
import { CarFront, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    <div className="flex flex-col space-y-4">
                        <Link to="/home" className="flex items-center space-x-2">
                            <CarFront className="text-blue-600 dark:text-blue-400 w-8 h-8" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">AutoManager</span>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your ultimate platform for managing personal vehicles, trading in the marketplace, and joining community discussions.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Links</h3>
                        <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <Link to="/garage" className="hover:text-blue-600 dark:hover:text-blue-400 transition">My Garage</Link>
                            <Link to="/marketplace" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Marketplace</Link>
                            <Link to="/forum" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Auto Forum</Link>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contact Us</h3>
                        <div className="flex flex-col space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>support@automanager.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>+359 88 123 4567</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>Plovdiv, Bulgaria</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex justify-center items-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} AutoManager. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}