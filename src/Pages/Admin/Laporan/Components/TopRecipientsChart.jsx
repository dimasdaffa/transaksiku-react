import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../Data/TransactionData';

const TopRecipientsChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const recipientMap = transactions.reduce((acc, transaction) => {
      const { recipient, amount } = transaction;
      
      if (!acc[recipient]) {
        acc[recipient] = {
          name: recipient,
          count: 0,
          totalAmount: 0
        };
      }
      
      acc[recipient].count += 1;
      acc[recipient].totalAmount += amount;
      
      return acc;
    }, {});
    
    return Object.values(recipientMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
  }, [transactions]);
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded">
          <p className="font-medium">{data.name}</p>
          <p>Jumlah Transaksi: {data.count}</p>
          <p>Total: {formatCurrency(data.totalAmount)}</p>
        </div>
      );
    }
    return null;
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
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={70} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(0)}K`;
              }
              return value;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="totalAmount" 
            name="Total (Rp)" 
            fill="#8884d8" 
            radius={[5, 5, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopRecipientsChart;