import React from 'react';
import { Award } from 'lucide-react';

const CheapestBadge = () => (
  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
    <Award size={14} />
    CHEAPEST OPTION
  </div>
);

export default CheapestBadge;