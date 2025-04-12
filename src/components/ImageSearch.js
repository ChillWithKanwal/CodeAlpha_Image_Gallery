import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaHistory, FaTimes, FaTrash, FaTags } from 'react-icons/fa';

const ImageSearch = ({ searchText, darkMode }) => {
  const [text, setText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  
  // Suggested search terms
  const suggestions = [
    'nature', 'technology', 'people', 'animals', 
    'architecture', 'food', 'travel', 'business'
  ];

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading search history:', e);
      }
    }
  }, []);

  // Close the history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowHistory(false);
    } else if (e.key === 'ArrowDown' && showHistory && searchHistory.length > 0) {
      e.preventDefault();
      const firstItem = historyRef.current?.querySelector('li');
      firstItem?.focus();
    }
  };

  const handleHistoryItemKeyDown = (e, term, index) => {
    if (e.key === 'Enter') {
      selectFromHistory(term);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextItem = e.target.nextElementSibling;
      if (nextItem) nextItem.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        inputRef.current?.focus();
      } else {
        const prevItem = e.target.previousElementSibling;
        if (prevItem) prevItem.focus();
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      searchText(text);
      addToHistory(text);
      setShowHistory(false);
    }
  };

  const addToHistory = (term) => {
    // Normalize term to remove duplicate searches with different cases
    const normalizedTerm = term.trim().toLowerCase();
    
    const newHistory = [
      term, 
      ...searchHistory.filter(item => item.toLowerCase() !== normalizedTerm)
    ].slice(0, 8); // Keep the last 8 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = (e) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const removeFromHistory = (e, termToRemove) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter(term => term !== termToRemove);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    if (newHistory.length === 0) {
      setShowHistory(false);
    }
  };

  const selectFromHistory = (term) => {
    setText(term);
    searchText(term);
    setShowHistory(false);
    inputRef.current?.focus();
  };
  
  const handleSuggestionClick = (suggestion) => {
    setText(suggestion);
    searchText(suggestion);
    addToHistory(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-xl mx-auto my-6 px-4" ref={searchContainerRef}>
      <form 
        onSubmit={onSubmit} 
        className={`relative flex items-center ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-300'
        } border-2 shadow-lg rounded-lg overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500`}
      >
        <div className="flex-grow flex items-center">
          <span className={`pl-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaSearch size={16} />
          </span>
          <input
            ref={inputRef}
            onChange={e => setText(e.target.value)}
            className={`w-full py-3 px-2 focus:outline-none text-lg font-medium ${
              darkMode ? 'bg-gray-800 text-white placeholder-gray-300' : 'bg-white text-gray-900 placeholder-gray-600'
            }`}
            type="text"
            placeholder="Search for images..."
            value={text}
            onFocus={() => { 
              if (searchHistory.length > 0) {
                setShowHistory(true);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search images"
          />
          {text && (
            <button
              type="button"
              className={`pr-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setText('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className={`px-4 py-3 h-full ${
            darkMode 
              ? 'bg-blue-700 hover:bg-blue-600 text-white' 
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          } transition-colors duration-300`}
          aria-label="Search"
        >
          <FaSearch className="text-xl" />
        </button>
      </form>
      
      {/* Search History Dropdown */}
      <div className="relative">
        <div 
          ref={historyRef}
          className={`relative left-0 right-0 z-50 mt-1 rounded-lg shadow-lg transform transition-all duration-200 ${
            showHistory && searchHistory.length > 0 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          } ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className={`text-lg font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <FaHistory className="mr-2" size={16} />
              Recent Searches
            </h3>
            <button 
              className={`px-3 py-1 text-xs font-bold rounded ${
                darkMode 
                  ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
              } transition-colors duration-200 flex items-center`}
              onClick={clearHistory}
              aria-label="Clear search history"
            >
              <FaTrash size={12} className="mr-1" />
              Clear All
            </button>
          </div>
          <ul className="max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {searchHistory.map((term, index) => (
              <li 
                key={index} 
                className={`py-2 px-4 cursor-pointer flex items-center justify-between group ${
                  darkMode 
                    ? 'text-white hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                } transition-colors duration-200`}
                onClick={() => selectFromHistory(term)}
                onKeyDown={(e) => handleHistoryItemKeyDown(e, term, index)}
                tabIndex="0"
                role="option"
                aria-selected="false"
              >
                <div className="flex items-center truncate">
                  <FaHistory className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={14} />
                  <span className="truncate">{term}</span>
                </div>
                <button 
                  className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full ${
                    darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                  onClick={(e) => removeFromHistory(e, term)}
                  aria-label={`Remove ${term} from history`}
                >
                  <FaTimes size={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Popular Searches Section */}
      <div className={`mt-2 p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Popular Searches
        </h3>
        <ul className="flex flex-wrap mt-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className={`m-2 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-white border border-blue-500 hover:bg-blue-600 hover:text-white' 
                : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200 hover:text-blue-800'
            }`} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ImageSearch;