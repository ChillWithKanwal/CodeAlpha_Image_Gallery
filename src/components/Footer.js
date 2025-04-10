import React from 'react';
import { FaHeart, FaGithub, FaReact, FaTwitter, FaLinkedin, FaCode } from 'react-icons/fa';

const Footer = ({ darkMode }) => {
  return (
    <footer 
      className={`py-8 ${darkMode 
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
      } transition-opacity duration-500`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div 
            className="mb-6 md:mb-0 transition-transform duration-300 hover:scale-102"
          >
            <h2 className="text-xl font-extrabold mb-2 text-white drop-shadow-md">Pixabay Gallery</h2>
            <p className="text-sm max-w-xs font-medium text-white">
              &copy; {new Date().getFullYear()} Image Gallery. All images are provided by Pixabay and are free for commercial use.
            </p>
          </div>
          
          <div 
            className="flex items-center mb-6 md:mb-0 transition-transform duration-300 hover:scale-105"
          >
            <p 
              className="flex items-center transition-transform duration-300 hover:-translate-y-1 text-white font-medium"
            >
              Made with 
              <span 
                className="mx-1 text-red-500 animate-pulse"
              >
                <FaHeart />
              </span> 
              using 
              <span 
                className="mx-1 text-blue-400 animate-spin animate-[spin_3s_linear_infinite]"
              >
                <FaReact className="inline ml-1" />
              </span>
              and Pixabay API
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 md:flex md:space-x-4">
            <a 
              href="https://pixabay.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
            >
              <FaCode className="text-xl mb-1 text-white group-hover:text-purple-200" />
              <span className="text-white font-bold group-hover:text-purple-200">API</span>
            </a>
            <a 
              href="https://github.com/yourusername/image-gallery" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
            >
              <FaGithub className="text-xl mb-1 text-white group-hover:text-purple-200" />
              <span className="text-white font-bold group-hover:text-purple-200">GitHub</span>
            </a>
            <a 
              href="https://twitter.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
            >
              <FaTwitter className="text-xl mb-1 text-white group-hover:text-purple-200" />
              <span className="text-white font-bold group-hover:text-purple-200">Twitter</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/sanakanwal-dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
            >
              <FaLinkedin className="text-xl mb-1 text-white group-hover:text-purple-200" />
              <span className="text-white font-bold group-hover:text-purple-200">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 