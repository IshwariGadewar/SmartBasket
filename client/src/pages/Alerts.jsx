import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const Alerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock data for now - in real app, fetch from API
    setAlerts([
      {
        id: '1',
        productName: 'Organic Bananas',
        platform: 'Amazon',
        currentPrice: 89,
        targetPrice: 80,
        alertType: 'price_drop',
        isActive: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        productName: 'Fresh Milk',
        platform: 'Blinkit',
        currentPrice: 45,
        targetPrice: 50,
        alertType: 'price_increase',
        isActive: false,
        createdAt: new Date('2024-01-10')
      }
    ]);
    setLoading(false);
  }, []);

  const removeAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const toggleAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BellIcon className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Price Alerts</h1>
              <p className="text-gray-600">Manage your price drop notifications</p>
            </div>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Alert</span>
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No price alerts</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create alerts to get notified when prices drop.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {alert.productName}
                    </h3>
                    <span className={`platform-badge platform-${alert.platform.toLowerCase()}`}>
                      {alert.platform}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      alert.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Price</p>
                      <p className="text-lg font-semibold text-gray-900">₹{alert.currentPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Target Price</p>
                      <p className="text-lg font-semibold text-primary-600">₹{alert.targetPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Alert Type</p>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {alert.alertType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    Created on {alert.createdAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      alert.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {alert.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
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

export default Alerts; 