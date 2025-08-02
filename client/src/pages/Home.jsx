import React, { useState, useEffect } from 'react';
import { useSearch } from '../contexts/SearchContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import ComparisonTable from '../components/ComparisonTable';
import PriceAnalysis from '../components/PriceAnalysis';
import PlatformAvailability from '../components/PlatformAvailability';
import SearchSuggestions from '../components/SearchSuggestions';
import { 
  MagnifyingGlassIcon, 
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { 
    searchResults, 
    matchedProducts, 
    priceAnalysis, 
    availablePlatforms, 
    unavailablePlatforms,
    productInfo,
    loading,
    searchHistory,
    suggestions,
    searchProducts,
    getSuggestions,
    clearResults
  } = useSearch();
  
  const { isAuthenticated, user } = useAuth();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async (query, pincode, platforms) => {
    const result = await searchProducts(query, pincode, platforms);
    if (result.success) {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    if (user?.pincode) {
      await searchProducts(suggestion, user.pincode, ['Amazon', 'Blinkit', 'Zepto', 'Instamart']);
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      setShowSuggestions(false);
    }
  }, [searchResults]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <div className="flex items-center justify-center mb-4">
          <SparklesIcon className="h-8 w-8 text-primary-600 mr-2" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            SmartCart AI
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Compare product prices across multiple platforms instantly. 
          Find the best deals with AI-powered product matching and smart price alerts.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12 px-4">
        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
          <p className="text-gray-600">
            Search by product name or paste product links. AI matches equivalent products across platforms.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Price Comparison</h3>
          <p className="text-gray-600">
            Compare prices, delivery charges, and delivery times across Amazon, Blinkit, Zepto, and Instamart.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Alerts</h3>
          <p className="text-gray-600">
            Set price drop alerts and get notified when products reach your target price.
          </p>
        </div>
      </div>

      {/* Search Results */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching across platforms...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-8 px-4">
          {/* Platform Availability */}
          {unavailablePlatforms.length > 0 && (
            <PlatformAvailability 
              available={availablePlatforms}
              unavailable={unavailablePlatforms}
            />
          )}

          {/* Product Info */}
          {productInfo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product Name</p>
                  <p className="font-medium">{productInfo.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="font-medium">{productInfo.quantity}</p>
                </div>
                {productInfo.brand && (
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-medium">{productInfo.brand}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{productInfo.category}</p>
                </div>
              </div>
            </div>
          )}

          {/* Price Analysis */}
          {priceAnalysis && (
            <PriceAnalysis analysis={priceAnalysis} />
          )}

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Price Comparison</h2>
              <p className="text-gray-600 mt-1">
                Found {searchResults.length} products across {availablePlatforms.length} platforms
              </p>
            </div>
            <ComparisonTable results={searchResults} />
          </div>

          {/* Clear Results */}
          <div className="text-center">
            <button
              onClick={clearResults}
              className="btn-secondary"
            >
              New Search
            </button>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <SearchSuggestions 
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}

      {/* Recent Searches */}
      {isAuthenticated && searchHistory.length > 0 && !searchResults.length && (
        <div className="mt-12 px-4">
          <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchHistory.slice(0, 6).map((search, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleSuggestionClick(search.query)}
              >
                <p className="font-medium text-gray-900">{search.query}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(search.timestamp).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {search.platforms.map(platform => (
                    <span 
                      key={platform}
                      className={`platform-badge platform-${platform.toLowerCase()}`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {!isAuthenticated && !searchResults.length && (
        <div className="text-center py-12 px-4">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Get More Features</h3>
            <p className="text-primary-100 mb-6">
              Sign up to save products, set price alerts, and track your shopping history.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Sign Up Free
              </button>
              <button className="border border-white text-white font-semibold py-2 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;