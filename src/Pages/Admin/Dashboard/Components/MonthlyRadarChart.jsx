import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { formatCurrency } from '../../../../utils/dummyData';

const MonthlyRadarChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md border border-gray-200 rounded">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex justify-center items-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart outerRadius={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="month" />
        <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          name="Transfer"
          dataKey="transfer"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
        <Radar
          name="Pembayaran"
          dataKey="payment"
          stroke="#82ca9d"
          fill="#82ca9d"
          fillOpacity={0.6}
        />
        <Radar
          name="Top Up"
          dataKey="topup"
          stroke="#ffc658"
          fill="#ffc658"
          fillOpacity={0.6}
        />
        <Radar
          name="Penarikan"
          dataKey="withdrawal"
          stroke="#ff8042"
          fill="#ff8042"
          fillOpacity={0.6}
        />
        <Radar
          name="Setoran"
          dataKey="deposit"
          stroke="#0088fe"
          fill="#0088fe"
          fillOpacity={0.6}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyRadarChart;