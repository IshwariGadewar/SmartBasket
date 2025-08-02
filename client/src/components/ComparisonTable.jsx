import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import { 
  StarIcon,
  BookmarkIcon,
  BellIcon,
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const ComparisonTable = ({ results }) => {
  const { isAuthenticated } = useAuth();
  const { saveProduct, removeSavedProduct, createAlert } = useSearch();
  const [showDetails, setShowDetails] = useState({});
  const [alertModal, setAlertModal] = useState(null);

  const handleSaveProduct = async (productId) => {
    if (!isAuthenticated) {
      // Show login prompt
      return;
    }
    
    try {
      await saveProduct(productId);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleCreateAlert = async (productId, targetPrice) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await createAlert(productId, targetPrice);
      setAlertModal(null);
    } catch (error) {
      console.error('Failed to create alert:', error);
    }
  };

  const toggleDetails = (productId) => {
    setShowDetails(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Amazon': 'orange',
      'Blinkit': 'blue',
      'Zepto': 'purple',
      'Instamart': 'green'
    };
    return colors[platform] || 'gray';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'Amazon': '🛒',
      'Blinkit': '⚡',
      'Zepto': '🚀',
      'Instamart': '🛍️'
    };
    return icons[platform] || '📦';
  };

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile Cards View */}
      <div className="md:hidden space-y-4">
        {results.map((product, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getPlatformIcon(product.platform)}</span>
                <span className={`platform-badge platform-${getPlatformColor(product.platform)}`}>
                  {product.platform}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">₹{product.price}</div>
                {product.deliveryCharges > 0 && (
                  <div className="text-sm text-gray-600">+₹{product.deliveryCharges} delivery</div>
                )}
              </div>
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
              <div>Quantity: {product.quantity}</div>
              <div>Delivery: {product.deliveryTime}</div>
              {product.rating > 0 && (
                <div className="flex items-center">
                  <StarIconSolid className="h-4 w-4 text-yellow-500 mr-1" />
                  {product.rating} ({product.reviewCount})
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => window.open(product.url, '_blank')}
                className="flex-1 btn-secondary text-sm"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                View
              </button>
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => handleSaveProduct(product._id)}
                    className="btn-secondary text-sm"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setAlertModal(product)}
                    className="btn-secondary text-sm"
                  >
                    <BellIcon className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getPlatformIcon(product.platform)}</span>
                    <span className={`platform-badge platform-${getPlatformColor(product.platform)}`}>
                      {product.platform}
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.quantity}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </div>
                  {product.deliveryCharges > 0 && (
                    <div className="text-sm text-gray-600">
                      +₹{product.deliveryCharges} delivery
                    </div>
                  )}
                  {product.discount > 0 && (
                    <div className="text-sm text-green-600">
                      {product.discount}% off
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div>Delivery: {product.deliveryTime}</div>
                    {product.rating > 0 && (
                      <div className="flex items-center mt-1">
                        <StarIconSolid className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-gray-500 ml-1">({product.reviewCount})</span>
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(product.url, '_blank')}
                      className="btn-secondary text-xs"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    {isAuthenticated && (
                      <>
                        <button
                          onClick={() => handleSaveProduct(product._id)}
                          className="btn-secondary text-xs"
                          title="Save Product"
                        >
                          <BookmarkIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setAlertModal(product)}
                          className="btn-secondary text-xs"
                          title="Set Price Alert"
                        >
                          <BellIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert Modal */}
      {alertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Set Price Alert</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <p className="text-sm text-gray-600">{alertModal.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Price
                </label>
                <p className="text-sm text-gray-600">₹{alertModal.price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Price
                </label>
                <input
                  type="number"
                  placeholder="Enter target price"
                  className="input-field"
                  defaultValue={Math.round(alertModal.price * 0.9)}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setAlertModal(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateAlert(alertModal._id, alertModal.price * 0.9)}
                className="btn-primary flex-1"
              >
                Set Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;