import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon, 
  BellIcon,
  TrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = React.useState({
    totalUsers: 1250,
    totalProducts: 8500,
    totalAlerts: 320,
    proUsers: 180,
    recentSearches: 45,
    platformStats: {
      Amazon: 45,
      Blinkit: 30,
      Zepto: 15,
      Instamart: 10
    }
  });

  const recentSearches = [
    { query: 'banana', count: 12, timestamp: '2 hours ago' },
    { query: 'milk', count: 8, timestamp: '3 hours ago' },
    { query: 'bread', count: 6, timestamp: '4 hours ago' },
    { query: 'eggs', count: 5, timestamp: '5 hours ago' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage SmartCart AI</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingBagIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Products Scraped</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BellIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUpIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pro Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.proUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
          <div className="space-y-4">
            {Object.entries(stats.platformStats).map(([platform, percentage]) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{platform}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
          <div className="space-y-3">
            {recentSearches.map((search, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <EyeIcon className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{search.query}</p>
                    <p className="text-xs text-gray-500">{search.timestamp}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{search.count} searches</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <UsersIcon className="h-4 w-4" />
            <span>Manage Users</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <ShoppingBagIcon className="h-4 w-4" />
            <span>View Products</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <BellIcon className="h-4 w-4" />
            <span>Manage Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;