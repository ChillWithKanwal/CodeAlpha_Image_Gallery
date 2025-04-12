import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaDownload, FaEye, FaTimes, FaShare, FaExpand, FaCompress, FaBookmark, FaPalette } from 'react-icons/fa';

const ImageCard = ({ image, darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [dominantColors, setDominantColors] = useState([]);
  const [isColorPaletteVisible, setIsColorPaletteVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  const shareButtonRef = useRef(null);
  const tags = image.tags.split(',');

  // Check if image is saved in localStorage on component mount
  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem('savedImages') || '[]');
    if (savedImages.includes(image.id)) {
      setIsSaved(true);
    }
    
    // Extract dominant colors from image
    extractColors();
    
    // Check if image is already cached
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
    }
  }, [image.id]);

  // Safe function to add/remove classList
  const safelyModifyClass = (element, action, className) => {
    if (element && element.classList) {
      try {
        if (action === 'add') {
          element.classList.add(className);
        } else if (action === 'remove') {
          element.classList.remove(className);
        }
      } catch (error) {
        console.error(`Error modifying class ${className}:`, error);
      }
    }
  };

  const extractColors = () => {
    // This is a simplified version - in production you would use a library like color-thief
    // For this demo, we'll generate 5 colors based on the image hash
    const hash = image.id.toString();
    const colors = [];
    
    for (let i = 0; i < 5; i++) {
      // Generate colors based on image hash to make them somewhat related to the image
      const h = (parseInt(hash.substring(i * 2, i * 2 + 2), 16) % 360);
      const s = 70 + (parseInt(hash.substring(i, i + 1), 16) % 30);
      const l = 40 + (parseInt(hash.substring(i + 1, i + 2), 16) % 30);
      colors.push(`hsl(${h}, ${s}%, ${l}%)`);
    }
    
    setDominantColors(colors);
  };

  const toggleSaved = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    
    // Save to localStorage
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
        .then(() => {
          // Show feedback
          const shareBtn = e.currentTarget;
          safelyModifyClass(shareBtn, 'add', 'bg-green-600');
          
          setTimeout(() => {
            safelyModifyClass(shareBtn, 'remove', 'bg-green-600');
          }, 1000);
          
          // Alert for older browsers
          alert('Image link copied to clipboard!');
        })
        .catch(err => console.error('Could not copy link: ', err));
    }
  };

  const toggleColorPalette = (e) => {
    e.stopPropagation();
    setIsColorPaletteVisible(!isColorPaletteVisible);
  };

  const copyColorToClipboard = (color, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color)
      .then(() => {
        // Visual feedback that color was copied
        const target = e.currentTarget;
        safelyModifyClass(target, 'add', 'scale-110');
        safelyModifyClass(target, 'add', 'ring-2');
        
        setTimeout(() => {
          safelyModifyClass(target, 'remove', 'scale-110');
          safelyModifyClass(target, 'remove', 'ring-2');
        }, 300);
      });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <div 
        className={`h-full transform transition-all duration-300 rounded-xl overflow-hidden hover:-translate-y-2 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border border-gray-300'
        } shadow-xl hover:shadow-2xl group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
              <div className={`w-10 h-10 border-t-2 border-b-2 rounded-full animate-spin ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
            </div>
          )}
          <img 
            ref={imageRef}
            className={`w-full h-56 object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
            src={image.webformatURL} 
            alt={image.tags}
            onClick={() => setShowModal(true)}
            loading="lazy"
            onLoad={handleImageLoad}
          />
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-90' : 'opacity-40'}`}
          />
          
          {/* Top Right Button Group */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              className="p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110"
              onClick={toggleSaved}
              title={isSaved ? "Remove from saved" : "Save image"}
            >
              <FaBookmark className={`transition-colors duration-300 ${isSaved ? 'text-blue-400' : 'text-white'}`} size={14} />
            </button>
            <button
              className="p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110"
              onClick={toggleColorPalette}
              title="View color palette"
            >
              <FaPalette size={14} className="text-white" />
            </button>
            <button
              className="p-2 rounded-full bg-black bg-opacity-75 text-white hover:bg-opacity-90 transition-all duration-300 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                window.open(image.pageURL, '_blank');
              }}
              title="View on Pixabay"
            >
              <FaExpand size={14} />
            </button>
          </div>
          
          {/* Color Palette Overlay */}
          {isColorPaletteVisible && (
            <div 
              className="absolute left-2 top-2 right-2 p-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-lg z-10 transform transition-all duration-300 animate-slideDown"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white text-xs font-bold">Color Palette</h4>
                <button 
                  onClick={toggleColorPalette}
                  className="text-white hover:text-gray-300"
                >
                  <FaTimes size={12} />
                </button>
              </div>
              <div className="flex space-x-2">
                {dominantColors.map((color, index) => (
                  <div 
                    key={index}
                    className="flex-1 transition-all duration-200 cursor-pointer rounded-md overflow-hidden h-6 transform hover:scale-105 ring-white"
                    style={{ backgroundColor: color }}
                    onClick={(e) => copyColorToClipboard(color, e)}
                    title={`Click to copy ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Image overlay info - visible on hover or touch */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-3 transform transition-all duration-300 bg-gradient-to-t from-black to-transparent ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 md:opacity-0 md:translate-y-4'
            }`}
            >
              <div className="flex justify-between items-center">
                <p className="text-white text-sm font-bold drop-shadow-md truncate">By {image.user}</p>
                <div className="flex space-x-2">
                  <button
                  className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 text-white transition-transform duration-300 transform hover:scale-110"
                    onClick={shareImage}
                    title="Share image"
                  >
                    <FaShare size={14} />
                  </button>
                  <button
                  className="bg-blue-700 hover:bg-blue-800 rounded-full p-2 text-white transition-transform duration-300 transform hover:scale-110"
                    onClick={() => setShowModal(true)}
                    title="View details"
                  >
                    <FaExpand size={14} />
                  </button>
                </div>
              </div>
            </div>
        </div>
        <div className={`px-6 py-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <div className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-purple-800'} mb-2 truncate`}>
            Photo by {image.user}
          </div>
          <div className="flex items-center justify-between mt-2 mb-4">
            <div 
              className="flex items-center transition-transform duration-300 hover:scale-110"
              title={`${image.views} views`}
            >
              <FaEye className={`mr-1 ${darkMode ? 'text-blue-300' : 'text-purple-800'}`} />
              <span className="text-sm font-bold">{image.views.toLocaleString()}</span>
            </div>
            <div 
              className="flex items-center transition-transform duration-300 hover:scale-110"
              title={`${image.downloads} downloads`}
            >
              <FaDownload className={`mr-1 ${darkMode ? 'text-blue-300' : 'text-purple-800'}`} />
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
                    ? 'bg-gray-700 text-blue-200 hover:bg-blue-600 hover:text-white' 
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-600 hover:text-white'
                }`}
              >
                #{tag.trim()}
              </span>
            ))}
          </div>         
        </div>
      </div>

      {/* Modal - Image Lightbox */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => {
            if (isZoomed) {
              setIsZoomed(false);
            } else {
              setShowModal(false);
            }
          }}
        >
          <div 
            className={`relative max-w-5xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 transform ${isZoomed ? 'max-w-full max-h-screen m-0 rounded-none' : ''} animate-scaleUp`}
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
                          ? 'bg-gray-700 text-blue-200' 
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
                      <FaEye className={`mr-2 ${darkMode ? 'text-blue-300' : 'text-purple-700'}`} size={20} />
                      <span className="font-bold">{image.views.toLocaleString()}</span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>Views</p>
                  </div>
                  <div 
                    className={`p-3 rounded-lg transition-transform duration-300 hover:scale-105 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div className="flex items-center justify-center">
                      <FaDownload className={`mr-2 ${darkMode ? 'text-blue-300' : 'text-purple-700'}`} size={20} />
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