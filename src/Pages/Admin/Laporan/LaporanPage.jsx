import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactionData, formatCurrency } from '../../../Data/TransactionData';
import FilterPanel from './Components/FilterPanel';
import SummaryCards from './Components/SummaryCards';
import TransactionTable from './Components/TransactionTable';
import TrendChart from './Components/TrendChart';
import StatusPieChart from './Components/StatusPieChart';
import TopRecipientsChart from './Components/TopRecipientsChart';

const LaporanPage = () => {
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: null,
      endDate: null
    },
    amountRange: {
      min: '',
      max: ''
    },
    status: [],
    recipient: ''
  });

  const { data: transactions = [], isLoading, isError } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactionData
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (filters.dateRange.startDate && filters.dateRange.endDate) {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(filters.dateRange.startDate);
        const endDate = new Date(filters.dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        
        if (transactionDate < startDate || transactionDate > endDate) {
          return false;
        }
      }

      if (filters.amountRange.min && transaction.amount < parseInt(filters.amountRange.min)) {
        return false;
      }
      if (filters.amountRange.max && transaction.amount > parseInt(filters.amountRange.max)) {
        return false;
      }

      if (filters.status.length > 0 && !filters.status.includes(transaction.status)) {
        return false;
      }

      if (filters.recipient && 
         !transaction.recipient.toLowerCase().includes(filters.recipient.toLowerCase()) &&
         !transaction.accountNumber.includes(filters.recipient)) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const summaryData = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return {
        totalTransactions: 0,
        totalAmount: 0,
        averageAmount: 0
      };
    }
    
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalTransactions: filteredTransactions.length,
      totalAmount,
      averageAmount: totalAmount / filteredTransactions.length
    };
  }, [filteredTransactions]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: {
        startDate: null,
        endDate: null
      },
      amountRange: {
        min: '',
        max: ''
      },
      status: [],
      recipient: ''
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Laporan Transaksi</h1>
      
      {/* Filter Panel */}
      <FilterPanel 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Terjadi kesalahan saat memuat data. Silakan coba lagi.
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada transaksi yang sesuai dengan filter yang dipilih.
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-6">
            <SummaryCards data={summaryData} />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Trend Chart */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Tren Transaksi</h2>
              <TrendChart transactions={filteredTransactions} />
            </div>
            
            {/* Status Distribution */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Distribusi Status</h2>
              <StatusPieChart transactions={filteredTransactions} />
            </div>
          </div>
          
          {/* Top Recipients Chart */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Rekening Penerima Teratas</h2>
            <TopRecipientsChart transactions={filteredTransactions} />
          </div>
          
          {/* Transaction Table */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Data Transaksi</h2>
            <TransactionTable transactions={filteredTransactions} />
          </div>
        </>
      )}
    </div>
  );
};

export default LaporanPage;