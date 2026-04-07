import React from 'react';
import MedicineCard from './MedicineCard';
import Skeleton from './Skeleton';

const MedicineList = ({ medicines, loading, title }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
      </div>
    );
  }

  if (!medicines || medicines.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border shadow-sm">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/1155/1155018.png" 
          alt="Not found" 
          className="w-24 mx-auto mb-4 opacity-20"
        />
        <h3 className="text-xl font-bold text-gray-400">No Medicines Found</h3>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-black text-gray-800 mb-8">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {medicines.map((med) => (
          <MedicineCard key={med._id} medicine={med} />
        ))}
      </div>
    </div>
  );
};

export default MedicineList;