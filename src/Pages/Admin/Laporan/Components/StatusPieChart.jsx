import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { STATUS_OPTIONS } from '../../../../Data/TransactionData';

const StatusPieChart = ({ transactions }) => {
  const statusColors = {
    [STATUS_OPTIONS.SUCCESS]: '#10b981', // green
    [STATUS_OPTIONS.PENDING]: '#f59e0b', // amber
    [STATUS_OPTIONS.FAILED]: '#ef4444',  // red
  };

  const chartData = useMemo(() => {
    const statusCounts = transactions.reduce((acc, transaction) => {
      const { status } = transaction;
      
      if (!acc[status]) {
        acc[status] = 0;
      }
      
      acc[status] += 1;
      
      return acc;
    }, {});
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      color: statusColors[status]
    }));
  }, [transactions]);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / transactions.length) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{data.name}</p>
          <p>Jumlah: {data.value}</p>
          <p>Persentase: {percentage}%</p>
        </div>
      );
    }
    return null;
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
      </div>
    );
  }
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;