import React, { useState, useEffect } from 'react';
import ImageCard from './components/ImageCard';
import ImageSearch from './components/ImageSearch';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [layout, setLayout] = useState('grid'); // 'grid' or 'masonry'
  const [sortBy, setSortBy] = useState(''); // '' (default), 'likes', 'views', 'downloads'

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, [term, category, page]);

  const fetchImages = () => {
    setIsLoading(true);
    fetch(`https://pixabay.com/api/?key=${process.env.REACT_APP_PIXABAY_API_KEY}&q=${term}&category=${category}&image_type=photo&page=${page}&per_page=15&pretty=true`)
      .then(res => res.json())
      .then(data => {
        let sortedHits = [...data.hits];
        
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
        setIsLoading(false);
      });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
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

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="transform transition duration-300">
          <ImageSearch 
            searchText={(text) => {
              setTerm(text);
              setPage(1);
            }} 
            darkMode={darkMode}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="transition-opacity duration-300">
            <label className={`block mb-2 font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Filter by Category:
            </label>
            <select 
              className={`w-full p-2 rounded-md border-2 focus:ring-2 focus:ring-opacity-50 transition-all ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-purple-500 text-white font-medium' 
                  : 'bg-white border-purple-400 focus:ring-purple-500 text-gray-800 font-medium'
              }`}
              onChange={handleCategoryChange}
              value={category}
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
              <option value="computer">Computer</option>
              <option value="food">Food</option>
              <option value="sports">Sports</option>
              <option value="transportation">Transportation</option>
              <option value="travel">Travel</option>
              <option value="buildings">Buildings</option>
              <option value="business">Business</option>
            </select>
          </div>
          
          <div className="transition-opacity duration-300">
            <label className={`block mb-2 font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Sort Results By:
            </label>
            <select 
              className={`w-full p-2 rounded-md border-2 focus:ring-2 focus:ring-opacity-50 transition-all ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-purple-500 text-white font-medium' 
                  : 'bg-white border-purple-400 focus:ring-purple-500 text-gray-800 font-medium'
              }`}
              onChange={handleSortChange}
              value={sortBy}
            >
              <option value="">Most Relevant</option>
              <option value="likes">Most Likes</option>
              <option value="views">Most Views</option>
              <option value="downloads">Most Downloads</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} p-1`}>
            <button
              onClick={() => handleLayoutChange('grid')}
              className={`px-4 py-2 text-sm font-bold rounded-md ${
                layout === 'grid' 
                  ? darkMode 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-purple-600 text-white'
                  : darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => handleLayoutChange('masonry')}
              className={`px-4 py-2 text-sm font-bold rounded-md ${
                layout === 'masonry' 
                  ? darkMode 
                    ? 'bg-purple-700 text-white' 
                    : 'bg-purple-600 text-white'
                  : darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Masonry View
            </button>
          </div>
        </div>
        
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center h-64">
            <div className={`w-16 h-16 border-t-4 border-b-4 rounded-full animate-spin ${darkMode ? 'border-purple-500' : 'border-purple-600'}`}></div>
          </div>
        ) : !isLoading && images.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <h2 className="text-2xl font-bold mb-2">No Images Found</h2>
            <p className="text-lg font-medium">Try a different search term or category.</p>
          </div>
        ) : (
          <>
            <div className={`${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'}`}>
              {images.map(image => (
                <div key={image.id} className={layout === 'masonry' ? 'mb-6 break-inside-avoid' : ''}>
                  <ImageCard image={image} darkMode={darkMode} />
                </div>
              ))}
            </div>
            
            {isLoading && page > 1 && (
              <div className="flex items-center justify-center h-20 mt-6">
                <div className={`w-10 h-10 border-t-4 border-b-4 rounded-full animate-spin ${darkMode ? 'border-purple-500' : 'border-purple-600'}`}></div>
              </div>
            )}
            
            <div className="flex justify-center mt-8 mb-4">
              <button 
                onClick={loadMoreImages}
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-purple-700 hover:bg-purple-600 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } shadow-md`}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More Images'}
              </button>
            </div>
          </>
        )}
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;