import React, { useState } from 'react';
import { FaHeart, FaGithub, FaReact, FaLinkedin, FaCode, FaEnvelope, FaPaperPlane, FaCheckCircle, FaInstagram } from 'react-icons/fa';

const Footer = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      // Reset after showing success message
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }, 1500);
  };

  return (
    <footer 
      className={`py-10 ${darkMode 
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
      } transition-opacity duration-500`}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: About */}
          <div className="mb-6 md:mb-0 transition-transform duration-300 hover:scale-102">
            <h2 className="text-xl font-extrabold mb-4 text-white drop-shadow-md">Pixabay Gallery</h2>
            <p className="text-sm max-w-xs font-medium text-white mb-4">
              &copy; {new Date().getFullYear()} Image Gallery. All images are provided by Pixabay and are free for commercial use. Our gallery helps you discover and download high-quality stock photos quickly and easily.
            </p>
            <div className="flex items-center mb-6 md:mb-0 transition-transform duration-300 hover:scale-105">
              <p className="flex items-center transition-transform duration-300 hover:-translate-y-1 text-white font-medium">
                Made with 
                <span className="mx-1 text-red-500 animate-pulse">
                  <FaHeart />
                </span> 
                using 
                <span className="mx-1 text-blue-400 animate-spin animate-[spin_3s_linear_infinite]">
                  <FaReact className="inline ml-1" />
                </span>
                and Pixabay API
              </p>
            </div>
          </div>
          
          {/* Column 2: Newsletter */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4 text-white">Subscribe to Newsletter</h2>
            <p className="text-sm text-white mb-4">
              Get updates on new features and curated collections delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col max-w-sm">
              <div className="relative mb-2">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-400 bg-blue-800 text-white text-sm">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`flex-grow py-2 px-4 block w-full rounded-r-md border-blue-400 bg-blue-800 bg-opacity-50 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    placeholder="Your email address"
                    disabled={subscribing || subscribed}
                  />
                </div>
                {error && <p className="text-red-300 text-xs mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={subscribing || subscribed}
                className={`self-start py-2 px-4 rounded transition-colors duration-300 flex items-center font-medium ${
                  subscribing ? 'bg-blue-800 cursor-wait' :
                  subscribed ? 'bg-green-600 cursor-default' :
                  'bg-blue-800 hover:bg-blue-900'
                }`}
              >
                {subscribing ? (
                  <>
                    <span className="animate-pulse">Subscribing...</span>
                  </>
                ) : subscribed ? (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
          
          {/* Column 3: Quick Links */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-white">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="https://pixabay.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
              >
                <FaCode className="text-xl mb-1 text-white group-hover:text-blue-200" />
                <span className="text-white font-bold group-hover:text-blue-200">API</span>
              </a>
              <a 
                href="https://github.com/ChillWithKanwal/CodeAlpha_Image_Gallery" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
              >
                <FaGithub className="text-xl mb-1 text-white group-hover:text-blue-200" />
                <span className="text-white font-bold group-hover:text-blue-200">GitHub</span>
              </a>
              <a 
                href="https://www.instagram.com/kanwalify/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
              >
                <FaInstagram className="text-xl mb-1 text-white group-hover:text-blue-200" />
                <span className="text-white font-bold group-hover:text-blue-200">Instagram</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/sanakanwal-dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center text-sm transition-transform duration-300 hover:-translate-y-1 group"
              >
                <FaLinkedin className="text-xl mb-1 text-white group-hover:text-blue-200" />
                <span className="text-white font-bold group-hover:text-blue-200">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom border */}
        <div className="border-t border-blue-400 border-opacity-30 pt-6 mt-4">
          <p className="text-center text-sm text-white opacity-80">
            &copy; {new Date().getFullYear()} Pixabay Gallery. All rights reserved. Images provided by Pixabay under the Pixabay License.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 