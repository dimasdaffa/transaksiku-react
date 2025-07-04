import dayjs from 'dayjs';

// Helper function to generate dates for the past 7 days
const getLast7Days = () => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    result.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return result;
};

// Total account balance
export const accountBalance = 12500000;

// Transactions today
export const transactionsToday = 14;

// Transaction counts by type
export const transactionCounts = {
  incoming: 124,
  outgoing: 93
};

// Last 7 days transactions data for line chart
export const weeklyTransactionData = getLast7Days().map(date => ({
  date,
  incoming: Math.floor(Math.random() * 15) + 5,
  outgoing: Math.floor(Math.random() * 10) + 3
}));

// Top 5 destination accounts
export const topDestinations = [
  { name: 'PT Listrik Negara', count: 12, amount: 2400000 },
  { name: 'Warung Makan Padang', count: 8, amount: 950000 },
  { name: 'Toko Sembako Jaya', count: 7, amount: 875000 },
  { name: 'Transportasi Online', count: 6, amount: 720000 },
  { name: 'Minimarket Dekat', count: 5, amount: 650000 }
];

// Transaction categories for pie chart
export const transactionCategories = [
  { name: 'Transfer', value: 45 },
  { name: 'Top Up', value: 30 },
  { name: 'Pembayaran', value: 25 }
];