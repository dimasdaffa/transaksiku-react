import React from 'react';
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

const TransactionLineChart = ({ data }) => {
  const formattedData = data.map(item => {
    const date = new Date(item.date);
    return {
      ...item,
      formattedDate: `${date.getDate()}/${date.getMonth() + 1}`
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="incoming" 
          stroke="#3b82f6" 
          activeDot={{ r: 8 }} 
          name="Transaksi Masuk"
        />
        <Line 
          type="monotone" 
          dataKey="outgoing" 
          stroke="#ef4444" 
          name="Transaksi Keluar"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TransactionLineChart;