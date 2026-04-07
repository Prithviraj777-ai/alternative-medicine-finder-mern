import React from 'react';
import CheapestBadge from './CheapestBadge';

const PriceComparisonTable = ({ original, alternatives, cheapestId }) => {
  const allMeds = [original, ...alternatives];

  return (
    <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
            <th className="p-5">Medicine Name</th>
            <th className="p-5">Manufacturer</th>
            <th className="p-5">Price</th>
            <th className="p-5">Savings</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {allMeds.map((med) => {
            const savings = original.price - med.price;
            const isOriginal = med._id === original._id;
            
            return (
              <tr key={med._id} className={`${isOriginal ? 'bg-blue-50/50' : ''} hover:bg-gray-50 transition-colors`}>
                <td className="p-5">
                  <div className="font-bold text-gray-800">
                    {med.name} {isOriginal && <span className="text-xs font-normal text-blue-500 ml-2">(Current)</span>}
                  </div>
                  {med._id === cheapestId && <CheapestBadge />}
                </td>
                <td className="p-5 text-gray-500">{med.manufacturer}</td>
                <td className="p-5">
                  <span className="text-lg font-bold">₹{med.price}</span>
                </td>
                <td className="p-5">
                  {savings > 0 ? (
                    <span className="text-green-600 font-bold">Save ₹{savings}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PriceComparisonTable;