import React from 'react';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className={`p-4 mr-4 rounded-full ${colorClass} bg-opacity-20 flex-shrink-0`}>
        <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value || 0}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
