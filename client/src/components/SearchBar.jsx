import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon,
  LinkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const platforms = [
  { name: 'Amazon', color: 'orange', icon: '🛒' },
  { name: 'Blinkit', color: 'blue', icon: '⚡' },
  { name: 'Zepto', color: 'purple', icon: '🚀' },
  { name: 'Instamart', color: 'green', icon: '🛍️' }
];

const SearchBar = ({ onSearch }) => {
  const { user } = useAuth();
  const { checkPincodeAvailability, getSuggestions } = useSearch();
  
  const [query, setQuery] = useState('');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState(platforms.map(p => p.name));
  const [availability, setAvailability] = useState({});
  const [isUrl, setIsUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      checkAvailability();
    }
  }, [pincode]);

  const checkAvailability = async () => {
    try {
      const result = await checkPincodeAvailability(pincode);
      setAvailability(result);
      
      // Update selected platforms based on availability
      const availablePlatforms = Object.entries(result)
        .filter(([_, available]) => available)
        .map(([platform]) => platform);
      
      setSelectedPlatforms(availablePlatforms);
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    setIsUrl(value.startsWith('http'));
    
    // Get suggestions if query is long enough
    if (value.length > 3 && !isUrl) {
      getSuggestions(value);
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || !pincode.trim() || selectedPlatforms.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onSearch(query.trim(), pincode.trim(), selectedPlatforms);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePlatformToggle = (platformName) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const isPlatformAvailable = (platformName) => {
    return availability[platformName] !== false;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isUrl ? (
              <LinkIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isUrl ? "Paste product URL here..." : "Search for products (e.g., Banana 1 dozen, iPhone 14)"}
            className="input-field pl-10 pr-4 py-3 text-lg"
          />
          {isUrl && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
            </div>
          )}
        </div>

        {/* Pincode Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter your pincode"
            className="input-field pl-10 pr-4 py-3"
            maxLength={6}
          />
          {pincode.length === 6 && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Platforms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms.map((platform) => {
              const isAvailable = isPlatformAvailable(platform.name);
              const isSelected = selectedPlatforms.includes(platform.name);
              
              return (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformToggle(platform.name)}
                  disabled={!isAvailable}
                  className={`
                    flex items-center space-x-2 p-3 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-primary-500 bg-primary-50 text-primary-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    ${!isAvailable 
                      ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                      : 'cursor-pointer hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.name}</span>
                  {!isAvailable && (
                    <span className="text-xs text-red-600 ml-auto">Unavailable</span>
                  )}
                </button>
              );
            })}
          </div>
          {Object.values(availability).some(v => v === false) && (
            <p className="text-xs text-gray-600 mt-2">
              Some platforms are unavailable for your pincode. 
              <button 
                onClick={() => setPincode('')}
                className="text-primary-600 hover:underline ml-1"
              >
                Change pincode
              </button>
            </p>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || !pincode.trim() || selectedPlatforms.length === 0 || loading}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all
            ${loading || !query.trim() || !pincode.trim() || selectedPlatforms.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search Products
            </div>
          )}
        </button>

        {/* Quick Tips */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Tip:</strong> You can search by product name or paste a product URL</p>
          <p>🎯 <strong>AI-Powered:</strong> Our AI matches equivalent products across platforms</p>
          <p>📍 <strong>Location:</strong> Results are filtered based on your pincode delivery availability</p>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;