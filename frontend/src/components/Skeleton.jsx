import React from 'react';

const Skeleton = () => (
  <div className="animate-pulse bg-white p-5 rounded-2xl border border-gray-100">
    <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex justify-between">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export default Skeleton;