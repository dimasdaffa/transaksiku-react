import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// Transaction status options
export const STATUS_OPTIONS = {
  SUCCESS: 'Berhasil',
  PENDING: 'Pending',
  FAILED: 'Gagal',
  SCHEDULED: 'Terjadwal'
};

// Transaction types
export const TRANSACTION_TYPES = {
  TRANSFER: 'Transfer',
  TOP_UP: 'Top Up',
  PAYMENT: 'Pembayaran',
  WITHDRAWAL: 'Penarikan',
  DEPOSIT: 'Setoran'
};

// Banks in Indonesia
export const BANKS = [
  'BCA', 'BRI', 'Mandiri', 'BNI', 'CIMB Niaga', 
  'Bank Permata', 'Bank Syariah Indonesia', 'Bank Danamon',
  'Bank BTN', 'Bank OCBC NISP', 'Panin Bank', 'Bank Mega',
  'Bank HSBC', 'Maybank', 'UOB', 'Bank DBS'
];

// Helper to get random item from array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper to get random amount
const getRandomAmount = (min = 10000, max = 5000000) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper to get random date within given range
const getRandomDate = (startDaysAgo = 365, endDaysAgo = 0) => {
  const today = dayjs();
  const start = today.subtract(startDaysAgo, 'day');
  const end = today.subtract(endDaysAgo, 'day');
  const diffDays = end.diff(start, 'day');
  const randomDaysToAdd = Math.floor(Math.random() * diffDays);
  return start.add(randomDaysToAdd, 'day').toDate();
};

// Helper to generate random status with probabilities
const getRandomStatus = () => {
  const rand = Math.random() * 100;
  if (rand < 75) {
    return STATUS_OPTIONS.SUCCESS; // 75% success
  } else if (rand < 85) {
    return STATUS_OPTIONS.PENDING; // 10% pending
  } else if (rand < 95) {
    return STATUS_OPTIONS.FAILED; // 10% failed
  } else {
    return STATUS_OPTIONS.SCHEDULED; // 5% scheduled
  }
};

// Generate saved accounts (20+)
export const savedAccounts = (() => {
  const names = [
    'Ahmad Rizky', 'Budi Santoso', 'Cindy Wijaya', 'Dewi Anggraini', 
    'Eko Prasetyo', 'Fitri Handayani', 'Gunawan Wibowo', 'Hana Purnama',
    'Indra Kusuma', 'Joko Widodo', 'Kartika Sari', 'Lina Mulyani',
    'Muhammad Ali', 'Nina Safitri', 'Oscar Darmawan', 'Putri Lestari',
    'Rizki Ramadhan', 'Siti Nurhayati', 'Tono Sucipto', 'Utami Dewi',
    'Vino Fernando', 'Wulan Sari', 'Xavier Putra', 'Yanti Sari'
  ];

  const accounts = [];
  for (let i = 0; i < 25; i++) {
    const name = names[i % names.length]; // Ensure we use all names
    const bank = BANKS[i % BANKS.length]; // Ensure we use all banks
    
    let accountNumber = '';
    switch (bank) {
      case 'BCA':
        accountNumber = `2${Math.floor(Math.random() * 10000000000).toString().padStart(9, '0')}`;
        break;
      case 'BRI':
        accountNumber = `002${Math.floor(Math.random() * 10000000000000).toString().padStart(12, '0')}`;
        break;
      case 'Mandiri':
        accountNumber = `008${Math.floor(Math.random() * 1000000000000).toString().padStart(10, '0')}`;
        break;
      default:
        accountNumber = Math.floor(Math.random() * 10000000000000).toString().padStart(13, '0');
    }
    
    accounts.push({
      id: uuidv4(),
      name,
      accountNumber,
      bank,
      createdAt: getRandomDate(180, 1).toISOString(),
      lastUsed: getRandomDate(30, 0).toISOString(),
      isFavorite: Math.random() > 0.7
    });
  }
  
  return accounts;
})();

// Generate transfer templates
export const transferTemplates = (() => {
  const templateNames = [
    'Bayar Kosan', 'Transfer Ibu', 'Bayar Kuliah', 'Gaji Asisten',
    'Tagihan Listrik', 'Internet Bulanan', 'Uang Jajan Adik', 'Tabungan Pribadi',
    'Investasi Reksadana', 'Angsuran Motor', 'Donasi Bulanan', 'Bayar Gym'
  ];
  
  return templateNames.map((name, index) => {
    const selectedAccount = savedAccounts[index % savedAccounts.length];
    
    return {
      id: `TMPL${index + 1}`,
      name,
      selectedAccount,
      rekening: selectedAccount.accountNumber,
      nominal: getRandomAmount(100000, 2000000),
      pesan: `Pembayaran ${name} bulan ${dayjs().format('MMMM YYYY')}`,
      createdAt: getRandomDate(90, 5).toISOString()
    };
  });
})();

// Generate transactions (EXACTLY 15)
export const transactions = (() => {
  const result = [];
  
  // Common categories for transactions
  const categories = [
    'Transfer', 'Pembayaran Tagihan', 'Belanja Online', 
    'Makanan & Minuman', 'Transportasi', 'Hiburan', 
    'Kesehatan', 'Pendidikan', 'Investasi'
  ];
  
  // Common payment targets
  const paymentTargets = [
    'PLN', 'Telkom', 'PDAM', 'Netflix', 'Spotify', 
    'Gojek', 'Grab', 'Tokopedia', 'Shopee', 'Lazada'
  ];
  
  // Generate exactly 15 transactions
  for (let i = 0; i < 15; i++) {
    const type = getRandomItem(Object.values(TRANSACTION_TYPES));
    const date = getRandomDate(30, 0); // Last 30 days for better visualization
    const status = getRandomStatus();
    const account = getRandomItem(savedAccounts);
    
    let description = '';
    let category = getRandomItem(categories);
    let amount = getRandomAmount();
    
    // Create context-specific descriptions based on type
    if (type === TRANSACTION_TYPES.TRANSFER) {
      description = `Transfer ke ${account.name}`;
    } else if (type === TRANSACTION_TYPES.PAYMENT) {
      const target = getRandomItem(paymentTargets);
      description = `Pembayaran ${target}`;
    } else if (type === TRANSACTION_TYPES.TOP_UP) {
      description = `Top Up ${getRandomItem(['OVO', 'GoPay', 'DANA', 'LinkAja', 'ShopeePay'])}`;
    } else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
      description = `Penarikan ATM ${getRandomItem(BANKS)}`;
      category = 'Penarikan';
    } else if (type === TRANSACTION_TYPES.DEPOSIT) {
      description = `Setoran ${getRandomItem(['Tunai', 'Cek', 'Transfer'])}`;
      category = 'Setoran';
    }
    
    const transaction = {
      id: `TRX${i.toString().padStart(3, '0')}`,
      date: date.toISOString(),
      amount,
      type,
      category,
      description,
      recipient: account.name,
      accountNumber: account.accountNumber,
      bank: account.bank,
      status,
      notes: status === STATUS_OPTIONS.FAILED ? 
        getRandomItem(['Saldo tidak mencukupi', 'Rekening tujuan tidak valid', 'Koneksi timeout']) : 
        '',
      scheduledDate: status === STATUS_OPTIONS.SCHEDULED ? 
        dayjs().add(getRandomAmount(1, 30), 'days').toISOString() : 
        null
    };
    
    result.push(transaction);
  }
  
  // Sort by date (most recent first)
  return result.sort((a, b) => new Date(b.date) - new Date(a.date));
})();

// Calculate total amount for all transactions
const totalTransactionAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
// Calculate average amount per transaction
const averageTransactionAmount = Math.round(totalTransactionAmount / transactions.length);

// Generate statistics for dashboard
export const dashboardStats = {
  accountBalance: 12500000, // Current balance
  totalTransactions: transactions.length,
  transactionsToday: transactions.filter(
    t => dayjs(t.date).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  ).length,
  
  // Transactions count by type
  transactionCounts: (() => {
    const counts = {};
    Object.values(TRANSACTION_TYPES).forEach(type => {
      counts[type] = transactions.filter(t => t.type === type).length;
    });
    return counts;
  })(),
  
  // Status distribution
  statusDistribution: (() => {
    const result = {};
    Object.values(STATUS_OPTIONS).forEach(status => {
      result[status] = transactions.filter(t => t.status === status).length;
    });
    return result;
  })(),
  
  // Weekly data for charts
  weeklyData: (() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      
      const dayTransactions = transactions.filter(
        t => dayjs(t.date).format('YYYY-MM-DD') === dateStr
      );
      
      const incoming = dayTransactions.filter(
        t => t.type === TRANSACTION_TYPES.DEPOSIT || t.type === TRANSACTION_TYPES.TOP_UP
      ).reduce((sum, t) => sum + t.amount, 0);
      
      const outgoing = dayTransactions.filter(
        t => t.type === TRANSACTION_TYPES.TRANSFER || t.type === TRANSACTION_TYPES.PAYMENT || t.type === TRANSACTION_TYPES.WITHDRAWAL
      ).reduce((sum, t) => sum + t.amount, 0);
      
      result.push({
        date: dateStr,
        incoming,
        outgoing,
        formattedDate: date.format('DD/MM')
      });
    }
    return result;
  })(),
  
  // Monthly data for radar chart
  monthlyData: (() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const month = dayjs().subtract(i, 'month');
      const monthStr = month.format('YYYY-MM');
      
      // Since we only have 15 transactions, we'll simulate data for other months
      const transferAmount = i === 0 ? 
        transactions.filter(t => t.type === TRANSACTION_TYPES.TRANSFER).reduce((sum, t) => sum + t.amount, 0) : 
        getRandomAmount(1000000, 3000000);
        
      const paymentAmount = i === 0 ?
        transactions.filter(t => t.type === TRANSACTION_TYPES.PAYMENT).reduce((sum, t) => sum + t.amount, 0) :
        getRandomAmount(500000, 1500000);
        
      const topupAmount = i === 0 ?
        transactions.filter(t => t.type === TRANSACTION_TYPES.TOP_UP).reduce((sum, t) => sum + t.amount, 0) :
        getRandomAmount(300000, 800000);
        
      const withdrawalAmount = i === 0 ?
        transactions.filter(t => t.type === TRANSACTION_TYPES.WITHDRAWAL).reduce((sum, t) => sum + t.amount, 0) :
        getRandomAmount(200000, 600000);
        
      const depositAmount = i === 0 ?
        transactions.filter(t => t.type === TRANSACTION_TYPES.DEPOSIT).reduce((sum, t) => sum + t.amount, 0) :
        getRandomAmount(400000, 1200000);
      
      result.push({
        month: month.format('MMM'),
        transfer: transferAmount,
        payment: paymentAmount,
        topup: topupAmount,
        withdrawal: withdrawalAmount,
        deposit: depositAmount
      });
    }
    return result;
  })(),
  
  // Top recipients data
  topRecipients: (() => {
    const recipientMap = {};
    
    transactions.forEach(t => {
      if (!recipientMap[t.recipient]) {
        recipientMap[t.recipient] = {
          name: t.recipient,
          count: 0,
          amount: 0
        };
      }
      
      recipientMap[t.recipient].count++;
      recipientMap[t.recipient].amount += t.amount;
    });
    
    // If we don't have enough recipients, create some extras
    const allRecipients = Object.values(recipientMap);
    if (allRecipients.length < 5) {
      for (let i = allRecipients.length; i < 5; i++) {
        const randomAccount = getRandomItem(savedAccounts);
        allRecipients.push({
          name: randomAccount.name,
          count: getRandomAmount(1, 4),
          amount: getRandomAmount(500000, 2000000)
        });
      }
    }
    
    return allRecipients
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  })(),
  
  // Transaction categories for pie chart
  categories: (() => {
    const categoryMap = {};
    
    transactions.forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      
      categoryMap[t.category]++;
    });
    
    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / transactions.length) * 100)
    }));
  })(),
  
  // Historical balance data for area chart (last 30 days)
  balanceHistory: (() => {
    const result = [];
    let balance = 10000000; // Starting balance 30 days ago
    
    for (let i = 30; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      
      // For most days, simulate small changes in balance
      let dailyChange = 0;
      
      // Use actual transactions for days that have them
      const dayTransactions = transactions.filter(
        t => dayjs(t.date).format('YYYY-MM-DD') === dateStr && t.status === STATUS_OPTIONS.SUCCESS
      );
      
      if (dayTransactions.length > 0) {
        const incoming = dayTransactions.filter(
          t => t.type === TRANSACTION_TYPES.DEPOSIT || t.type === TRANSACTION_TYPES.TOP_UP
        ).reduce((sum, t) => sum + t.amount, 0);
        
        const outgoing = dayTransactions.filter(
          t => t.type === TRANSACTION_TYPES.TRANSFER || t.type === TRANSACTION_TYPES.PAYMENT || t.type === TRANSACTION_TYPES.WITHDRAWAL
        ).reduce((sum, t) => sum + t.amount, 0);
        
        dailyChange = incoming - outgoing;
      } else {
        // Simulate small random changes for days without transactions
        dailyChange = Math.random() > 0.5 ? 
          getRandomAmount(50000, 200000) : 
          -getRandomAmount(30000, 150000);
      }
      
      balance = balance + dailyChange;
      
      result.push({
        date: dateStr,
        balance,
        formattedDate: date.format('DD/MM')
      });
    }
    
    return result;
  })()
};

// Helper to format currency in IDR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Helper to format date
export const formatDate = (dateString) => {
  return dayjs(dateString).format('DD MMM YYYY, HH:mm');
};