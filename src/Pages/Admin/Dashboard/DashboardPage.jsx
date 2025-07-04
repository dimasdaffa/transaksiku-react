import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardStats } from '../../../utils/dummyData';
import { useUser } from '../../../context/UserContext';
import StatisticsCard from './Components/StatisticsCard';
import TransactionLineChart from './Components/TransactionLineChart';
import TopDestinationsChart from './Components/TopDestinationsChart';
import CategoryPieChart from './Components/CategoryPieChart';
import BalanceAreaChart from './Components/BalanceAreaChart';
import MonthlyRadarChart from './Components/MonthlyRadarChart';
import ErrorBoundary from '../../../Components/ErrorBoundary';

// Function to simulate data fetching with React Query
const fetchDashboardData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return dashboardStats;
};

const DashboardPage = () => {
  const { theme } = useUser();
  
  // Fetch dashboard data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
        <p className="text-gray-600 mt-2">{error?.message || "Terjadi kesalahan yang tidak diketahui"}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 ${theme === 'dark' ? 'dark' : ''}`}>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Dashboard Analytics</h1>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ErrorBoundary>
          <StatisticsCard 
            title="Total Saldo" 
            value={formatRupiah(data.accountBalance)}
            icon="💰"
            color="bg-green-100" 
            iconColor="text-green-600"
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <StatisticsCard 
            title="Total Transaksi" 
            value={data.totalTransactions}
            icon="📊"
            color="bg-blue-100"
            iconColor="text-blue-600"
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <StatisticsCard 
            title="Transaksi Hari Ini" 
            value={data.transactionsToday}
            icon="📆"
            color="bg-purple-100"
            iconColor="text-purple-600"
          />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <StatisticsCard 
            title="Transaksi Sukses" 
            value={`${data.statusDistribution.Berhasil || 0} Transaksi`}
            icon="✅"
            color="bg-yellow-100"
            iconColor="text-yellow-600"
          />
        </ErrorBoundary>
      </div>

      {/* Area Chart - Balance History */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Perkembangan Saldo</h2>
        <ErrorBoundary>
          <BalanceAreaChart data={data.balanceHistory} />
        </ErrorBoundary>
      </div>

      {/* Line & Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Transaksi 7 Hari Terakhir</h2>
          <ErrorBoundary>
            <TransactionLineChart data={data.weeklyData} />
          </ErrorBoundary>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Top 5 Rekening Tujuan</h2>
          <ErrorBoundary>
            <TopDestinationsChart data={data.topRecipients} />
          </ErrorBoundary>
        </div>
      </div>

      {/* Pie & Radar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Kategori Transaksi</h2>
          <ErrorBoundary>
            <div className="flex justify-center">
              <div className="w-full md:w-3/4">
                <CategoryPieChart data={data.categories} />
              </div>
            </div>
          </ErrorBoundary>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Perbandingan Bulanan</h2>
          <ErrorBoundary>
            <MonthlyRadarChart data={data.monthlyData} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;