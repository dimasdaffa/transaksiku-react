import React from 'react';

const StatisticsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`${color} p-6 rounded-lg shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-700 text-sm font-medium">{title}</h3>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatisticsCard;