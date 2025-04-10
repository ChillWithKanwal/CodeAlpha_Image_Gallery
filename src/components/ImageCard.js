import React, { useState } from 'react';
import { FaHeart, FaDownload, FaEye, FaTimes, FaShare, FaExpand, FaCompress, FaBookmark } from 'react-icons/fa';

const ImageCard = ({ image, darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const tags = image.tags.split(',');

  const toggleSaved = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    // Optional: Could implement actual saving functionality with localStorage
    const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
    if (!isSaved) {
      localStorage.setItem('savedImages', JSON.stringify([...savedImages, image.id]));
    } else {
      localStorage.setItem('savedImages', JSON.stringify(savedImages.filter(id => id !== image.id)));
    }
  };
  
  const shareImage = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Pixabay Image by ${image.user}`,
        text: `Check out this image from Pixabay by ${image.user}`,
        url: image.pageURL,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(image.pageURL)
        .then(() => alert('Image link copied to clipboard!'))
        .catch(err => console.error('Could not copy link: ', err));
    }
  };

  return (
    <>
      <div 
        className={`h-full transform transition-all duration-300 rounded-xl overflow-hidden hover:-translate-y-2 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-300'
        } shadow-xl hover:shadow-2xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden group">
          <img 
            className="w-full h-56 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            src={image.webformatURL} 
            alt={image.tags}
            onClick={() => setShowModal(true)}
          />
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-30'}`}
          />
          
          {/* Top Right Button Group */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              className="p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-all duration-300"
              onClick={toggleSaved}
              title={isSaved ? "Remove from saved" : "Save image"}
            >
              <FaBookmark className={isSaved ? 'text-purple-400' : 'text-white'} size={14} />
            </button>
            <button
              className="p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                window.open(image.pageURL, '_blank');
              }}
              title="View on Pixabay"
            >
              <FaExpand size={14} />
            </button>
          </div>
          
          {isHovered && (
            <div 
              className="absolute bottom-0 left-0 right-0 p-3 transform transition-all duration-300 bg-gradient-to-t from-black to-transparent"
            >
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-bold drop-shadow-md truncate">By {image.user}</p>
                <div className="flex space-x-2">
                  <button
                    className="bg-purple-700 hover:bg-purple-800 rounded-full p-2 text-white transition-transform duration-300 transform hover:scale-110"
                    onClick={shareImage}
                    title="Share image"
                  >
                    <FaShare size={14} />
                  </button>
                  <button
                    className="bg-purple-700 hover:bg-purple-800 rounded-full p-2 text-white transition-transform duration-300 transform hover:scale-110"
                    onClick={() => setShowModal(true)}
                    title="View details"
                  >
                    <FaExpand size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <div className={`text-xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-800'} mb-2 truncate`}>
            Photo by {image.user}
          </div>
          <div className="flex items-center justify-between mt-2 mb-4">
            <div 
              className="flex items-center transition-transform duration-300 hover:scale-110"
              title={`${image.views} views`}
            >
              <FaEye className={`mr-1 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`} />
              <span className="text-sm font-bold">{image.views.toLocaleString()}</span>
            </div>
            <div 
              className="flex items-center transition-transform duration-300 hover:scale-110"
              title={`${image.downloads} downloads`}
            >
              <FaDownload className={`mr-1 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`} />
              <span className="text-sm font-bold">{image.downloads.toLocaleString()}</span>
            </div>
            <div 
              className="flex items-center transition-transform duration-300 hover:scale-110"
              title={`${image.likes} likes`}
            >
              <FaHeart className="mr-1 text-red-500" />
              <span className="text-sm font-bold">{image.likes.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className={`px-6 py-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-300'}`}>
          <div className="flex flex-wrap">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className={`inline-block rounded-full px-3 py-1 text-sm font-bold mr-2 mb-2 transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-700 text-purple-200 hover:bg-purple-600 hover:text-white' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-600 hover:text-white'
                }`}
              >
                #{tag.trim()}
              </span>
            ))}
          </div>         
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 transition-opacity duration-300"
          onClick={() => {
            if (isZoomed) {
              setIsZoomed(false);
            } else {
              setShowModal(false);
            }
          }}
        >
          <div 
            className={`relative max-w-5xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 transform ${isZoomed ? 'max-w-full max-h-screen m-0 rounded-none' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex items-center space-x-3">
              <button
                className="p-2 rounded-full bg-gray-800 bg-opacity-80 text-white hover:bg-opacity-100 transition-transform duration-300 transform hover:scale-110"
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? "Exit fullscreen" : "Fullscreen"}
              >
                {isZoomed ? <FaCompress size={16} /> : <FaExpand size={16} />}
              </button>
              <button 
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 focus:outline-none transition-transform duration-300 transform hover:scale-110"
                onClick={() => setShowModal(false)}
                title="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>
            <div className="p-1 relative">
              <div className={`overflow-hidden ${isZoomed ? 'h-screen' : 'max-h-[70vh]'}`}>
                <img 
                  src={image.largeImageURL} 
                  alt={image.tags} 
                  className={`w-full rounded object-contain transition-all duration-500 ${isZoomed ? 'cursor-zoom-out max-h-screen' : 'cursor-zoom-in max-h-[70vh]'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
              {!isZoomed && (
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="bg-black bg-opacity-80 px-4 py-2 rounded-lg">
                    <p className="text-white text-sm font-bold">Click to zoom</p>
                  </div>
                </div>
              )}
            </div>
            {!isZoomed && (
              <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <h3 className="text-2xl font-bold mb-3">Photo by {image.user}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`inline-block rounded-full px-3 py-1 text-sm font-bold transition-transform duration-300 hover:scale-105 ${
                        darkMode 
                          ? 'bg-gray-700 text-purple-200' 
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div 
                    className={`p-3 rounded-lg transition-transform duration-300 hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-center">
                      <FaEye className={`mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`} size={20} />
                      <span className="font-bold">{image.views.toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Views</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg transition-transform duration-300 hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-center">
                      <FaDownload className={`mr-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`} size={20} />
                      <span className="font-bold">{image.downloads.toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Downloads</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg transition-transform duration-300 hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-center">
                      <FaHeart className="mr-2 text-red-500" size={20} />
                      <span className="font-bold">{image.likes.toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Likes</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                  <a 
                    href={image.largeImageURL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`px-6 py-3 rounded-lg font-bold transition-transform duration-300 hover:scale-105 flex items-center ${
                      darkMode 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-purple-700 hover:bg-purple-800 text-white'
                    }`}
                    download
                  >
                    <FaDownload className="mr-2" />
                    Download Image
                  </a>
                  <button
                    onClick={shareImage}
                    className={`px-6 py-3 rounded-lg font-bold transition-transform duration-300 hover:scale-105 flex items-center ${
                      darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <FaShare className="mr-2" />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ImageCard;