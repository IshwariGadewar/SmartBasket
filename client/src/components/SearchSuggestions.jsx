import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchSuggestions = ({ suggestions, onSuggestionClick }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Search Suggestions</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
            className="flex items-center space-x-2 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-primary-300"
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{suggestion}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Click on any suggestion to search for that product
      </p>
    </div>
  );
};

export default SearchSuggestions; 