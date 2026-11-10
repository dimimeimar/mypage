import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { useTranslation } from '../../hooks/useTranslation';

const SearchBar = ({ onResultSelect, className = '' }) => {
  const { t, language } = useTranslation();

  const {
    searchTerm,
    searchResults,
    isSearching,
    showResults,
    hasResults,
    handleSearchChange,
    clearSearch,
    hideResults
  } = useSearch('', language); // Pass language to useSearch

  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        hideResults();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideResults]);

  const handleResultClick = (result) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    hideResults();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasResults && onResultSelect) {
      onResultSelect(searchResults[0]);
      hideResults();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-1">
          <input
            ref={searchRef}
            type="text"
            placeholder={t('search.placeholder')}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 bg-white"
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary-600 text-white px-6 py-3 rounded-r-lg hover:bg-primary-700 transition-colors flex items-center justify-center min-w-[60px]"
          disabled={isSearching}
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Search Results */}
      {showResults && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-50 animate-fade-in"
        >
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <span className="mt-2 block">{t('common.loading')}</span>
            </div>
          ) : hasResults ? (
            <div>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-gray-900 truncate">
                    {result.subject}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {result.category} • {result.section}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {t('search.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;