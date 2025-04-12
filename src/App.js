import React, { useState, useEffect, useRef } from 'react';
import ImageCard from './components/ImageCard';
import ImageSearch from './components/ImageSearch';
import Header from './components/Header';
import Footer from './components/Footer';
import { FaArrowUp, FaImages, FaSync, FaSadTear, FaChevronDown } from 'react-icons/fa';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [page, setPage] = useState(1);
  const [layout, setLayout] = useState(localStorage.getItem('layout') || 'grid'); // 'grid' or 'masonry'
  const [sortBy, setSortBy] = useState(localStorage.getItem('sortBy') || ''); // '' (default), 'likes', 'views', 'downloads'
  const [totalHits, setTotalHits] = useState(0);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [viewSaved, setViewSaved] = useState(false);
  const [savedImages, setSavedImages] = useState([]);
  const [animation, setAnimation] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  
  const mainRef = useRef(null);

  // Load user preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode !== darkMode) {
      setDarkMode(savedDarkMode);
    }
    
    // Add scroll event listener for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save user preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    localStorage.setItem('layout', layout);
    localStorage.setItem('sortBy', sortBy);
  }, [darkMode, layout, sortBy]);

  // Fetch images when search params change
  useEffect(() => {
    if (!viewSaved) {
      fetchImages();
    }
    // eslint-disable-next-line
  }, [term, category, page, sortBy, viewSaved]);
  
  // Load saved images when viewing saved images
  useEffect(() => {
    if (viewSaved) {
      loadSavedImages();
    }
  }, [viewSaved]);
  
  // Add click outside listener for category dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadSavedImages = async () => {
    setIsLoading(true);
    try {
      const savedImageIds = JSON.parse(localStorage.getItem('savedImages') || '[]');
      if (savedImageIds.length === 0) {
        setSavedImages([]);
        setIsLoading(false);
        return;
      }
      
      // Fetch details for each saved image
      const savedImagesData = [];
      for (const id of savedImageIds) {
        try {
          const response = await fetch(`https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&id=${id}`);
          const data = await response.json();
          if (data.hits && data.hits.length > 0) {
            savedImagesData.push(data.hits[0]);
          }
        } catch (error) {
          console.error(`Error fetching image ${id}:`, error);
        }
      }
      
      setSavedImages(savedImagesData);
    } catch (err) {
      console.error('Error loading saved images:', err);
      setError('Failed to load saved images');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImages = () => {
    setIsLoading(true);
    setError(null);
    
    // Apply animation to the main content when fetching new images
    setAnimation('animate-fadeOut');
    setTimeout(() => setAnimation('animate-fadeIn'), 300);
    
    // Handle special categories that aren't directly supported by Pixabay API
    let searchTerm = term;
    let categoryParam = category;
    
    // If technology is selected as category, add it to search term and reset category
    if (category === 'technology') {
      searchTerm = term ? `${term} technology` : 'technology';
      categoryParam = '';
    }
    
    // If computer is selected, use computer as search term
    if (category === 'computer') {
      searchTerm = term ? `${term} computer` : 'computer';
      categoryParam = '';
    }
    
    fetch(`https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${searchTerm}&category=${categoryParam}&image_type=photo&page=${page}&per_page=15&pretty=true`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        let sortedHits = [...data.hits];
        setTotalHits(data.totalHits);
        
        // Sort the results if sortBy is specified
        if (sortBy === 'likes') {
          sortedHits.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'views') {
          sortedHits.sort((a, b) => b.views - a.views);
        } else if (sortBy === 'downloads') {
          sortedHits.sort((a, b) => b.downloads - a.downloads);
        }
        
        if (page === 1) {
          setImages(sortedHits);
        } else {
          setImages(prevImages => [...prevImages, ...sortedHits]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to fetch images. Please try again later.');
        setIsLoading(false);
      });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
    setViewSaved(false);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryDropdownOpen(false);
    setPage(1);
    setViewSaved(false);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const loadMoreImages = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const handleViewSaved = () => {
    setViewSaved(true);
    setPage(1);
  };
  
  const handleViewAll = () => {
    setViewSaved(false);
    setTerm('');
    setCategory('');
    setPage(1);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        onCategorySelect={handleCategorySelect}
        onViewSaved={handleViewSaved}
      />
      
      <main className={`container mx-auto px-4 py-6 flex-grow ${animation}`} ref={mainRef}>
        <div className="transform transition duration-300">
          <ImageSearch 
            searchText={(text) => {
              setTerm(text);
              setCategory('');
              setPage(1);
              setViewSaved(false);
            }} 
            darkMode={darkMode}
          />
        </div>

        {/* Recent searches - Always on top of other sections */}
        {!viewSaved && (images.length === 0 || !term) && !error && (
          <div className={`max-w-md mx-auto mt-6 mb-10 p-4 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} relative z-40`}>
            <p className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'} text-center`}>
              Try one of these popular searches:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['nature', 'technology', 'people', 'animals', 'architecture'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setTerm(cat);
                    setCategory('');
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full capitalize transition-all ${
                    darkMode 
                      ? 'bg-gray-700 text-blue-400 hover:bg-gray-600 border border-gray-600' 
                      : 'bg-gray-50 text-blue-700 hover:bg-gray-100 shadow-sm border border-gray-200'
                  } hover:scale-105 transform duration-200`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* View controls - categories, sorting, layout */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 mb-6 mt-4 relative z-30">
          <div className="md:w-1/3 transition-opacity duration-300">
            <label className={`block mb-2 font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Filter by Category:
            </label>
            <div className="relative">
              <select 
                className={`w-full p-2 rounded-md border-2 focus:ring-2 focus:ring-opacity-50 transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white font-medium' 
                    : 'bg-white border-blue-400 focus:ring-blue-500 text-gray-800 font-medium'
                } appearance-none cursor-pointer`}
                onChange={handleCategoryChange}
                value={category}
                disabled={viewSaved}
              >
                <option value="">All Categories</option>
                <option value="backgrounds">Backgrounds</option>
                <option value="fashion">Fashion</option>
                <option value="nature">Nature</option>
                <option value="science">Science</option>
                <option value="education">Education</option>
                <option value="feelings">Feelings</option>
                <option value="health">Health</option>
                <option value="people">People</option>
                <option value="religion">Religion</option>
                <option value="places">Places</option>
                <option value="animals">Animals</option>
                <option value="industry">Industry</option>
                <option value="food">Food</option>
                <option value="sports">Sports</option>
                <option value="transportation">Transportation</option>
                <option value="travel">Travel</option>
                <option value="buildings">Buildings</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="computer">Computer/Electronics</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <FaChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} w-4 h-4`} />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 transition-opacity duration-300">
            <label className={`block mb-2 font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Sort Results By:
            </label>
            <div className="relative">
              <select 
                className={`w-full p-2 rounded-md border-2 focus:ring-2 focus:ring-opacity-50 transition-all ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 focus:ring-blue-500 text-white font-medium' 
                    : 'bg-white border-blue-400 focus:ring-blue-500 text-gray-800 font-medium'
                } appearance-none cursor-pointer`}
                onChange={handleSortChange}
                value={sortBy}
              >
                <option value="">Most Relevant</option>
                <option value="likes">Most Likes</option>
                <option value="views">Most Views</option>
                <option value="downloads">Most Downloads</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <FaChevronDown className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} w-4 h-4`} />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/3 flex flex-col">
            <label className={`block mb-2 font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Layout View:
            </label>
            <div className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} p-1 h-full`}>
              <button
                onClick={() => handleLayoutChange('grid')}
                className={`flex-1 px-4 py-2 text-sm font-bold rounded-md flex items-center justify-center ${
                  layout === 'grid' 
                    ? darkMode 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                } touch-manipulation`}
              >
                <FaImages className="mr-2" /> Grid
              </button>
              <button
                onClick={() => handleLayoutChange('masonry')}
                className={`flex-1 px-4 py-2 text-sm font-bold rounded-md flex items-center justify-center ${
                  layout === 'masonry' 
                    ? darkMode 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-blue-600 text-white'
                    : darkMode 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                } touch-manipulation`}
              >
                <FaImages className="mr-2" /> Masonry
              </button>
            </div>
          </div>
        </div>
        
        {/* View toggle between All and Saved */}
        <div className="flex justify-center mb-6 relative z-20">
          <div className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} p-1`}>
            <button
              onClick={handleViewAll}
              className={`px-6 py-2 text-sm font-bold rounded-md ${
                !viewSaved 
                  ? darkMode 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              } touch-manipulation`}
            >
              All Images
            </button>
            <button
              onClick={handleViewSaved}
              className={`px-6 py-2 text-sm font-bold rounded-md ${
                viewSaved 
                  ? darkMode 
                    ? 'bg-blue-700 text-white' 
                    : 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              } touch-manipulation`}
            >
              Saved Images
            </button>
          </div>
        </div>
        
        {/* Stats bar for searches */}
        {!viewSaved && totalHits > 0 && (
          <div className={`mb-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'} relative z-10`}>
            <p>Found <span className="font-bold">{totalHits.toLocaleString()}</span> images
              {term ? ` for "${term}"` : ''}
              {category ? (
                category === 'technology' || category === 'computer' 
                ? ` in "${category}" category` 
                : ` in ${category} category`
              ) : ''}
            </p>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className={`text-center py-6 mb-6 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-800'}`}>
            <p className="font-bold">{error}</p>
            <button
              onClick={fetchImages}
              className={`mt-2 px-4 py-2 rounded-lg font-medium flex items-center mx-auto ${
                darkMode ? 'bg-red-800 hover:bg-red-700 text-white' : 'bg-red-200 hover:bg-red-300 text-red-900'
              }`}
            >
              <FaSync className="mr-2" /> Try Again
            </button>
          </div>
        )}
        
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center h-64">
            <div className={`w-16 h-16 border-t-4 border-b-4 rounded-full animate-spin ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
          </div>
        ) : !isLoading && ((viewSaved && savedImages.length === 0) || (!viewSaved && images.length === 0)) ? (
          <div className={`text-center py-12 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FaSadTear className={`mx-auto text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h2 className="text-2xl font-bold mb-2">
              {viewSaved ? 'No Saved Images' : 'No Images Found'}
            </h2>
            <p className="text-lg font-medium mb-6">
              {viewSaved 
                ? 'You haven\'t saved any images yet. Browse and save images that you like!'
                : 'Try a different search term or category.'
              }
            </p>
            
            {viewSaved && (
              <button
                onClick={handleViewAll}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } shadow-md`}
              >
                Browse Images
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={`${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8'}`}>
              {(viewSaved ? savedImages : images).map(image => (
                <div key={image.id} className={`${layout === 'masonry' ? 'mb-8 break-inside-avoid' : ''}`}>
                  <ImageCard image={image} darkMode={darkMode} />
                </div>
              ))}
            </div>
            
            {isLoading && page > 1 && (
              <div className="flex items-center justify-center h-20 mt-6">
                <div className={`w-10 h-10 border-t-4 border-b-4 rounded-full animate-spin ${darkMode ? 'border-blue-500' : 'border-blue-600'}`}></div>
              </div>
            )}
            
            {!viewSaved && !isLoading && images.length > 0 && images.length < totalHits && (
              <div className="flex justify-center my-8">
                <button 
                  onClick={loadMoreImages}
                  className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                    darkMode 
                      ? 'bg-blue-700 hover:bg-blue-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } shadow-md touch-manipulation active:scale-95`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More Images'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      
      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-110 ${
            darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          } active:scale-95 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
      
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;