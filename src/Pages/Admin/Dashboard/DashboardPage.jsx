import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  accountBalance, 
  transactionsToday, 
  transactionCounts, 
  weeklyTransactionData,
  topDestinations,
  transactionCategories 
} from '../../../Data/DashboardData';
import StatisticsCard from './Components/StatisticsCard';
import TransactionLineChart from './Components/TransactionLineChart';
import TopDestinationsChart from './Components/TopDestinationsChart';
import CategoryPieChart from './Components/CategoryPieChart';

// Function to simulate data fetching with React Query
const fetchDashboardData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    balance: accountBalance,
    transactionsToday,
    transactionCounts,
    weeklyTransactionData,
    topDestinations,
    transactionCategories
  };
};

const DashboardPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-xl">Gagal memuat data dashboard</div>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Analytics</h1>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatisticsCard 
          title="Total Saldo" 
          value={formatRupiah(data.balance)}
          icon="💰"
          color="bg-green-100" 
        />
        <StatisticsCard 
          title="Transaksi Hari Ini" 
          value={data.transactionsToday}
          icon="📊"
          color="bg-blue-100" 
        />
        <StatisticsCard 
          title="Transaksi Terbanyak" 
          value={`Masuk: ${data.transactionCounts.incoming} vs Keluar: ${data.transactionCounts.outgoing}`}
          icon="⚖️"
          color="bg-purple-100" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Transaksi 7 Hari Terakhir</h2>
          <TransactionLineChart data={data.weeklyTransactionData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 Rekening Tujuan</h2>
          <TopDestinationsChart data={data.topDestinations} />
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Kategori Transaksi</h2>
        <div className="flex justify-center">
          <div className="w-full md:w-1/2">
            <CategoryPieChart data={data.transactionCategories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;