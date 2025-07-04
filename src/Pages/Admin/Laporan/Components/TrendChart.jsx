import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../../../Data/TransactionData';

const TrendChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    // Group transactions by date
    const groupedByDate = transactions.reduce((acc, transaction) => {
      const date = dayjs(transaction.date).format('YYYY-MM-DD');
      
      if (!acc[date]) {
        acc[date] = {
          date,
          totalAmount: 0,
          count: 0
        };
      }
      
      acc[date].totalAmount += transaction.amount;
      acc[date].count += 1;
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    let result = Object.values(groupedByDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Format dates for display
    result = result.map(item => ({
      ...item,
      formattedDate: dayjs(item.date).format('DD/MM')
    }));
    
    return result;
  }, [transactions]);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
          <p className="font-bold text-gray-700">{dayjs(label).format('DD MMM YYYY')}</p>
          <p className="text-gray-600">
            Jumlah Transaksi: {payload[0].payload.count}
          </p>
          <p className="text-gray-600">
            Total: {formatCurrency(payload[0].payload.totalAmount)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
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
          <Line
            type="monotone"
            dataKey="totalAmount"
            name="Total (Rp)"
            stroke="#3b82f6"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;