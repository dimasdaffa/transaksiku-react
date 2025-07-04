import dayjs from 'dayjs';

const getLast7Days = () => {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    result.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return result;
};

export const accountBalance = 12500000;

export const transactionsToday = 14;

export const transactionCounts = {
  incoming: 124,
  outgoing: 93
};

export const weeklyTransactionData = getLast7Days().map(date => ({
  date,
  incoming: Math.floor(Math.random() * 15) + 5,
  outgoing: Math.floor(Math.random() * 10) + 3
}));

export const topDestinations = [
  { name: 'PT Listrik Negara', count: 12, amount: 2400000 },
  { name: 'Warung Makan Padang', count: 8, amount: 950000 },
  { name: 'Toko Sembako Jaya', count: 7, amount: 875000 },
  { name: 'Transportasi Online', count: 6, amount: 720000 },
  { name: 'Minimarket Dekat', count: 5, amount: 650000 }
];

export const transactionCategories = [
  { name: 'Transfer', value: 45 },
  { name: 'Top Up', value: 30 },
  { name: 'Pembayaran', value: 25 }
];