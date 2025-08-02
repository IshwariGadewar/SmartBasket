import React from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PlatformAvailability = ({ available, unavailable }) => {
  const platforms = [
    { name: 'Amazon', color: 'orange' },
    { name: 'Blinkit', color: 'blue' },
    { name: 'Zepto', color: 'purple' },
    { name: 'Instamart', color: 'green' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
        Platform Availability
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Platforms */}
        <div>
          <h4 className="font-medium text-green-700 mb-3 flex items-center">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Available Platforms ({available.length})
          </h4>
          <div className="space-y-2">
            {platforms.map(platform => {
              const isAvailable = available.includes(platform.name);
              if (!isAvailable) return null;
              
              return (
                <div key={platform.name} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full bg-${platform.color}-500`}></div>
                  <span className="text-sm font-medium">{platform.name}</span>
                  <CheckCircleIcon className="h-4 w-4 text-green-600 ml-auto" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Unavailable Platforms */}
        {unavailable.length > 0 && (
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center">
              <XCircleIcon className="h-4 w-4 mr-2" />
              Unavailable Platforms ({unavailable.length})
            </h4>
            <div className="space-y-2">
              {platforms.map(platform => {
                const isUnavailable = unavailable.includes(platform.name);
                if (!isUnavailable) return null;
                
                return (
                  <div key={platform.name} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${platform.color}-500`}></div>
                    <span className="text-sm font-medium">{platform.name}</span>
                    <XCircleIcon className="h-4 w-4 text-red-600 ml-auto" />
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              These platforms don't deliver to your pincode. Try updating your location in profile settings.
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-medium">{available.length}</span> out of {platforms.length} platforms 
          are available for your location. 
          {unavailable.length > 0 && (
            <span className="text-red-600">
              {' '}Some platforms may not deliver to your pincode.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default PlatformAvailability; 