import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaGithub, FaSearch, FaBars, FaTimes, FaPhotoVideo, FaInfoCircle, FaBookmark } from 'react-icons/fa';

const Header = ({ darkMode, toggleDarkMode, onCategorySelect, onViewSaved }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Listen for scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when clicking a link
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleViewSavedClick = () => {
    if (onViewSaved) {
      onViewSaved();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`py-3 sticky top-0 z-40 transition-all duration-300 ${
        darkMode 
        ? `bg-gradient-to-r from-gray-900 to-gray-800 text-white ${scrolled ? 'shadow-lg shadow-gray-900/20' : ''}` 
        : `bg-gradient-to-r from-blue-600 to-blue-700 text-white ${scrolled ? 'shadow-lg shadow-blue-500/20' : ''}`
      } ${scrolled ? 'py-2' : 'py-3'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
            <h1 
              className="text-2xl font-extrabold flex items-center transition-transform duration-500 hover:scale-105 text-white drop-shadow-md"
            >
              <span 
                className="inline-block mr-2 animate-bounce"
              >
                <FaPhotoVideo className={`text-white ${scrolled ? 'text-xl' : 'text-2xl'} transition-all duration-300`} />
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">Pixabay Gallery</span>
            </h1>
            
            <button 
              className="md:hidden flex items-center text-white p-2 rounded-md hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          <div 
            className={`${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 md:max-h-screen opacity-0 md:opacity-100 invisible md:visible'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto transition-all duration-300 overflow-hidden`}
          >
            <a 
              href="#search"
              className="flex items-center text-white font-bold hover:text-blue-200 transition-colors duration-300 transform hover:scale-105 group py-2 md:py-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaSearch className="mr-2 group-hover:rotate-12 transition-transform duration-300" size={16} />
              <span>Search</span>
            </a>
            
            <button
              onClick={handleViewSavedClick}
              className="flex items-center w-full md:w-auto justify-center md:justify-start text-white font-bold hover:text-blue-200 transition-colors duration-300 transform hover:scale-105 group py-2 md:py-0"
            >
              <FaBookmark className="mr-2 group-hover:rotate-12 transition-transform duration-300" size={16} />
              <span>Saved</span>
            </button>
            
            <button
              onClick={() => {
                setShowInfo(!showInfo);
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full md:w-auto justify-center md:justify-start text-white font-bold hover:text-blue-200 transition-colors duration-300 transform hover:scale-105 group py-2 md:py-0"
            >
              <FaInfoCircle className="mr-2 group-hover:rotate-12 transition-transform duration-300" size={16} />
              <span>About</span>
            </button>
            
            <a 
              href="https://github.com/ChillWithKanwal/CodeAlpha_Image_Gallery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full md:w-auto justify-center md:justify-start text-white font-bold hover:text-blue-200 transition-colors duration-300 transform hover:scale-105 group py-2 md:py-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaGithub className="mr-2 group-hover:rotate-12 transition-transform duration-300" size={20} />
              <span>GitHub</span>
            </a>
            
            <button 
              onClick={() => {
                toggleDarkMode();
                setMobileMenuOpen(false);
              }} 
              className={`p-2 rounded-full flex items-center justify-center md:justify-start transition-all duration-300 transform hover:scale-110 w-full md:w-auto ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                  : 'bg-blue-800 text-white hover:bg-blue-900'
              }`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <>
                  <FaSun size={18} className="animate-spin-slow" />
                  <span className="ml-2 text-sm font-bold">Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon size={18} />
                  <span className="ml-2 text-sm font-bold">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* About Info Modal */}
      {showInfo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowInfo(false)}
        >
          <div 
            className={`relative max-w-md w-full rounded-lg shadow-xl p-6 transform transition-all duration-300 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } animate-scaleUp`}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowInfo(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaPhotoVideo className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
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
              <li>Color palette extraction</li>
              <li>Save favorite images</li>
              <li>Responsive design for all devices</li>
            </ul>
            <div className="flex justify-end">
              <button
                className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-bold transition-colors`}
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