import React from 'react';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyRupeeIcon, StarIcon } from '@heroicons/react/24/outline';

const PriceAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const { bestValue, priceRange, recommendations } = analysis;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ArrowTrendingUpIcon className="h-5 w-5 text-primary-600 mr-2" />
        Price Analysis
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Best Value */}
        {bestValue && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Best Value Option</h4>
            <div className="space-y-2">
              <p className="text-sm text-green-700">
                <span className="font-medium">{bestValue.name}</span>
              </p>
              <p className="text-sm text-green-700">
                Platform: <span className="font-medium">{bestValue.platform}</span>
              </p>
              <p className="text-sm text-green-700">
                Price: <span className="font-medium">₹{bestValue.price}</span>
              </p>
              {bestValue.deliveryCharges > 0 && (
                <p className="text-sm text-green-700">
                  Delivery: <span className="font-medium">₹{bestValue.deliveryCharges}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Price Range */}
        {priceRange && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Price Range</h4>
            <div className="space-y-2">
              <p className="text-sm text-blue-700">
                Lowest: <span className="font-medium">₹{priceRange.min}</span>
              </p>
              <p className="text-sm text-blue-700">
                Highest: <span className="font-medium">₹{priceRange.max}</span>
              </p>
              <p className="text-sm text-blue-700">
                Difference: <span className="font-medium">₹{priceRange.max - priceRange.min}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-3">AI Recommendations</h4>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2">
                <StarIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Trend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Price Insights</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {bestValue ? '✓' : '—'}
            </div>
            <div className="text-gray-600">Best Deal</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {priceRange ? `${Math.round((priceRange.max - priceRange.min) / priceRange.max * 100)}%` : '—'}
            </div>
            <div className="text-gray-600">Price Variance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {bestValue?.deliveryTime || '—'}
            </div>
            <div className="text-gray-600">Fastest Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {bestValue?.rating || '—'}
            </div>
            <div className="text-gray-600">Best Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis; 