import { useState, useEffect, useMemo } from 'react';
import { searchSubjectsWithLanguage } from '../data/subjects';

export const useSearch = (initialQuery = '', language = 'el') => {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Memoize search results με language support
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return searchSubjectsWithLanguage(searchTerm, language);
  }, [searchTerm, language]);

  // Debounce effect για αποφυγή πολλαπλών αναζητήσεων
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setIsSearching(true);
    setShowResults(value.length >= 2);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    setIsSearching(false);
  };

  const hideResults = () => {
    setShowResults(false);
  };

  return {
    searchTerm,
    searchResults,
    isSearching,
    showResults,
    handleSearchChange,
    clearSearch,
    hideResults,
    hasResults: searchResults.length > 0
  };
};