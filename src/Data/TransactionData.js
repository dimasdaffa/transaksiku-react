import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

export const STATUS_OPTIONS = {
  SUCCESS: 'Berhasil',
  PENDING: 'Pending',
  FAILED: 'Gagal'
};

export const TRANSACTION_TYPES = {
  TRANSFER: 'Transfer',
  TOP_UP: 'Top Up',
  PAYMENT: 'Pembayaran'
};

const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomAmount = (min = 10000, max = 5000000) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomDate = (daysAgo = 30) => {
  const today = dayjs();
  const randomDaysAgo = Math.floor(Math.random() * daysAgo);
  return today.subtract(randomDaysAgo, 'day').toDate();
};

const getRandomStatus = () => {
  const rand = Math.random() * 100;
  if (rand < 80) {
    return STATUS_OPTIONS.SUCCESS; // 80% success
  } else if (rand < 95) {
    return STATUS_OPTIONS.PENDING; // 15% pending
  } else {
    return STATUS_OPTIONS.FAILED; // 5% failed
  }
};

export const generateTransactionData = () => {
  const count = 50; // Fixed count to exactly 15
  
  const recipients = [
    { name: 'Ahmad Rizky', accountNumber: '1234567890', bank: 'BCA' },
    { name: 'Budi Santoso', accountNumber: '0987654321', bank: 'BRI' },
    { name: 'Cindy Wijaya', accountNumber: '2468135790', bank: 'Mandiri' },
    { name: 'Dewi Anggraini', accountNumber: '1357924680', bank: 'BNI' },
    { name: 'Eko Prasetyo', accountNumber: '5678901234', bank: 'CIMB Niaga' },
  ];

  const transactions = [];
  for (let i = 0; i < count; i++) {
    const recipient = getRandomItem(recipients);
    const transactionType = getRandomItem([
      TRANSACTION_TYPES.TRANSFER,
      TRANSACTION_TYPES.TOP_UP,
      TRANSACTION_TYPES.PAYMENT
    ]);
    
    const date = getRandomDate();
    const amount = getRandomAmount();
    const status = getRandomStatus();
    
    let description = '';
    if (transactionType === TRANSACTION_TYPES.TRANSFER) {
      description = `Transfer ke ${recipient.name}`;
    } else if (transactionType === TRANSACTION_TYPES.TOP_UP) {
      description = `Top Up via ${getRandomItem(['OVO', 'GoPay', 'DANA'])}`;
    } else {
      description = `Pembayaran ${getRandomItem(['Listrik', 'Internet', 'PDAM'])}`;
    }

    transactions.push({
      id: uuidv4(),
      date: date.toISOString(),
      amount,
      recipient: recipient.name,
      accountNumber: recipient.accountNumber,
      bank: recipient.bank,
      description,
      type: transactionType,
      status,
      notes: status === STATUS_OPTIONS.FAILED ? getRandomItem([
        'Saldo tidak mencukupi',
        'Rekening tujuan tidak valid'
      ]) : ''
    });
  }

  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const fetchTransactionData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  localStorage.removeItem('transaksiku_transactions');
  
  const generatedData = generateTransactionData();
  localStorage.setItem('transaksiku_transactions', JSON.stringify(generatedData));
  return generatedData;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  return dayjs(dateString).format('DD MMM YYYY, HH:mm');
};