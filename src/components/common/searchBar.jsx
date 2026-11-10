import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { useTranslation } from '../../hooks/useTranslation';

const SearchBar = ({ onResultSelect, placeholder, className = '' }) => {
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
  } = useSearch('', language);

  const wrapRef = useRef(null);

  // Κλείσιμο αποτελεσμάτων με κλικ έξω από το component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) hideResults();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideResults]);

  const handleResultClick = (result) => {
    if (onResultSelect) onResultSelect(result);
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
    <div ref={wrapRef} className={`search ${className}`}>
      <form onSubmit={handleSubmit} className="search__field" role="search">
        <Search size={18} />
        <input
          type="text"
          placeholder={placeholder || t('search.placeholder')}
          aria-label={placeholder || t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button type="button" className="search__clear" onClick={clearSearch} aria-label="Clear">
            <X size={16} />
          </button>
        )}
      </form>

      {showResults && (
        <div className="search__results">
          {isSearching ? (
            <div className="search__empty">{t('common.loading')}</div>
          ) : hasResults ? (
            searchResults.map((result, index) => (
              <button key={index} className="search__result" onClick={() => handleResultClick(result)}>
                <strong>{result.subject}</strong>
                <span>{result.category} • {result.section}</span>
              </button>
            ))
          ) : (
            <div className="search__empty">{t('search.noResults')}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
