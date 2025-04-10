return (
  <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
    <div className="container mx-auto">
      {!isLoading && images.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] py-12">
          <img src="/empty.svg" alt="No images found" className="w-64 mb-6 opacity-80" />
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>No Images Found</h2>
          <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We couldn't find any images matching your search. Try something different or explore our popular categories below.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {['nature', 'technology', 'people', 'animals', 'architecture'].map(category => (
              <button
                key={category}
                onClick={() => searchText(category)}
                className={`px-4 py-2 rounded-full capitalize transition-all ${
                  darkMode 
                    ? 'bg-gray-800 text-teal-400 hover:bg-gray-700' 
                    : 'bg-white text-teal-700 hover:bg-gray-50 shadow-sm'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="spinner">
            <div className={`double-bounce1 ${darkMode ? 'bg-teal-500' : 'bg-teal-600'}`}></div>
            <div className={`double-bounce2 ${darkMode ? 'bg-cyan-500' : 'bg-cyan-600'}`}></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 px-4">
          {images.map(image => (
            <ImageCard 
              key={image.id} 
              image={image} 
              darkMode={darkMode} 
              onImageClick={() => openLightbox(image)}
            />
          ))}
        </div>
      )}
      
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center pb-8">
          <div className={`inline-flex rounded-md shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                darkMode 
                  ? 'border-gray-700 text-gray-300 bg-gray-800 disabled:text-gray-600 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 bg-white disabled:text-gray-400 hover:bg-gray-50'
              } disabled:cursor-not-allowed transition-colors`}
            >
              Previous
            </button>
            
            {paginationButtons}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                darkMode 
                  ? 'border-gray-700 text-gray-300 bg-gray-800 disabled:text-gray-600 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 bg-white disabled:text-gray-400 hover:bg-gray-50'
              } disabled:cursor-not-allowed transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {lightboxImage && (
        <Lightbox 
          image={lightboxImage} 
          onClose={closeLightbox} 
          darkMode={darkMode}
        />
      )}
    </div>
  </div>
); 