import React from 'react';
import MedicineCard from './MedicineCard';

const AlternativeList = ({ alternatives, cheapestId }) => {
  if (!alternatives || alternatives.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-100 p-8 rounded-3xl text-center">
        <p className="text-yellow-700 font-medium">
          No other brands found with the exact same salt composition in our database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Matching Alternatives</h3>
        <span className="text-sm text-gray-500">{alternatives.length} options found</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alternatives.map((med) => (
          <MedicineCard 
            key={med._id} 
            medicine={med} 
            isCheapest={med._id === cheapestId} 
          />
        ))}
      </div>
    </div>
  );
};

export default AlternativeList;