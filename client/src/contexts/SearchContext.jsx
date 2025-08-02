import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [priceAnalysis, setPriceAnalysis] = useState(null);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [unavailablePlatforms, setUnavailablePlatforms] = useState([]);
  const [productInfo, setProductInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const searchProducts = async (query, pincode, platforms) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/search', {
        query,
        pincode,
        platforms
      });

      const {
        products,
        matchedProducts: matched,
        priceAnalysis: analysis,
        availablePlatforms: available,
        unavailablePlatforms: unavailable,
        productInfo: info
      } = response.data;

      setSearchResults(products);
      setMatchedProducts(matched);
      setPriceAnalysis(analysis);
      setAvailablePlatforms(available);
      setUnavailablePlatforms(unavailable);
      setProductInfo(info);

      // Add to search history
      setSearchHistory(prev => [
        { query, pincode, platforms, timestamp: new Date() },
        ...prev.slice(0, 9) // Keep only last 10 searches
      ]);

      toast.success(`Found ${products.length} products across ${available.length} platforms`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Search failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (query) => {
    try {
      const response = await axios.get(`/api/suggestions?query=${encodeURIComponent(query)}`);
      setSuggestions(response.data.suggestions);
      return response.data.suggestions;
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  };

  const checkPincodeAvailability = async (pincode) => {
    try {
      const response = await axios.get(`/api/pincode/${pincode}/availability`);
      return response.data.availability;
    } catch (error) {
      console.error('Failed to check pincode availability:', error);
      return {};
    }
  };

  const saveProduct = async (productId) => {
    try {
      await axios.post('/api/save-product', { productId });
      toast.success('Product saved successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save product';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeSavedProduct = async (productId) => {
    try {
      await axios.delete(`/api/save-product/${productId}`);
      toast.success('Product removed from saved list');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove product';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const createAlert = async (productId, targetPrice, alertType = 'price_drop', customMessage) => {
    try {
      await axios.post('/api/alert', {
        productId,
        targetPrice,
        alertType,
        customMessage
      });
      toast.success('Price alert created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create alert';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setMatchedProducts([]);
    setPriceAnalysis(null);
    setAvailablePlatforms([]);
    setUnavailablePlatforms([]);
    setProductInfo(null);
  };

  const value = {
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
    checkPincodeAvailability,
    saveProduct,
    removeSavedProduct,
    createAlert,
    clearResults
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 