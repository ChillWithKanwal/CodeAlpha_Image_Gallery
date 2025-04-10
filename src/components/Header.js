import React, { useState } from 'react';
import { FaSun, FaMoon, FaGithub, FaSearch, FaBars, FaTimes, FaPhotoVideo, FaInfoCircle } from 'react-icons/fa';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <header 
      className={`py-4 sticky top-0 z-40 ${darkMode 
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
      } shadow-lg transition-transform duration-500 ease-out`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 
              className="text-2xl font-extrabold flex items-center transition-transform duration-300 hover:scale-105 text-white drop-shadow-md"
            >
              <span 
                className="inline-block mr-2 animate-bounce"
              >
                <FaPhotoVideo className="text-white" />
              </span>
              Pixabay Gallery
            </h1>
            
            <button 
              className="md:hidden flex items-center text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          <div 
            className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto transition-all duration-300`}
          >
            <a 
              href="#search"
              className="flex items-center text-white font-bold hover:text-purple-200 transition-colors duration-300 transform hover:scale-105"
            >
              <FaSearch className="mr-2" size={16} />
              <span>Search</span>
            </a>
            
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center text-white font-bold hover:text-purple-200 transition-colors duration-300 transform hover:scale-105"
            >
              <FaInfoCircle className="mr-2" size={16} />
              <span>About</span>
            </button>
            
            <a 
              href="https://github.com/yourusername/image-gallery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-white font-bold hover:text-purple-200 transition-colors duration-300 transform hover:scale-105"
            >
              <FaGithub className="mr-2" size={20} />
              <span>GitHub</span>
            </a>
            
            <button 
              onClick={toggleDarkMode} 
              className={`p-2 rounded-full flex items-center transition-all duration-300 transform hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                  : 'bg-purple-800 text-white hover:bg-purple-900'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <>
                  <FaSun size={18} />
                  <span className="ml-2 text-sm font-bold">Light</span>
                </>
              ) : (
                <>
                  <FaMoon size={18} />
                  <span className="ml-2 text-sm font-bold">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* About Info Modal */}
      {showInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => setShowInfo(false)}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg shadow-xl p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowInfo(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaPhotoVideo className={`mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} />
              About This App
            </h2>
            <p className="mb-3">
              This image gallery app uses the Pixabay API to showcase beautiful, free stock photos.
            </p>
            <p className="mb-3">
              Features include:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Search for images</li>
              <li>Filter by category</li>
              <li>Sort by popularity</li>
              <li>Switch between grid and masonry layouts</li>
              <li>Dark/light mode</li>
              <li>Fullscreen image view</li>
              <li>Search history</li>
            </ul>
            <div className="flex justify-end">
              <button
                className={`px-4 py-2 rounded ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white font-bold transition-colors`}
                onClick={() => setShowInfo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 