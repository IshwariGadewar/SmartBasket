import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookmarkIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const SavedProducts = () => {
  const { user } = useAuth();
  const [savedProducts, setSavedProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock data for now - in real app, fetch from API
    setSavedProducts([
      {
        id: '1',
        name: 'Organic Bananas',
        platform: 'Amazon',
        price: 89,
        originalPrice: 120,
        quantity: '1 dozen',
        imageUrl: 'https://via.placeholder.com/150',
        url: '#'
      },
      {
        id: '2',
        name: 'Fresh Milk',
        platform: 'Blinkit',
        price: 45,
        originalPrice: 55,
        quantity: '1 liter',
        imageUrl: 'https://via.placeholder.com/150',
        url: '#'
      }
    ]);
    setLoading(false);
  }, []);

  const removeProduct = (productId) => {
    setSavedProducts(prev => prev.filter(p => p.id !== productId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <BookmarkIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Saved Products</h1>
            <p className="text-gray-600">Your bookmarked products for quick access</p>
          </div>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No saved products</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start saving products to see them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{product.quantity}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className={`platform-badge platform-${product.platform.toLowerCase()}`}>
                        {product.platform}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => window.open(product.url, '_blank')}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProducts; 