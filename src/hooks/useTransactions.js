import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactions as dummyTransactions } from '../utils/dummyData';
import { useUser } from '../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const STORAGE_KEY = 'transactions_data';

// Helper to simulate API call delay
const simulateApiCall = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const useTransactions = () => {
  const { updateBalance } = useUser();
  const queryClient = useQueryClient();
  
  // Fetch transactions
  const fetchTransactions = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Try to get from localStorage
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // If not in localStorage, use dummy data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyTransactions));
    return dummyTransactions;
  };
  
  // Query transactions
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions
  });
  
  // Add transaction mutation with optimistic update
  const addTransaction = useMutation({
    mutationFn: async (newTransaction) => {
      // Generate ID and other fields if not provided
      const transaction = {
        id: newTransaction.id || `TRX${Date.now()}`,
        date: newTransaction.date || new Date().toISOString(),
        ...newTransaction
      };
      
      // Simulate API call
      await simulateApiCall(transaction);
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['transactions']) || [];
      const updatedData = [transaction, ...currentData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return transaction;
    },
    onMutate: async (newTransaction) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      
      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData(['transactions']);
      
      // Optimistically update the cache
      const optimisticTransaction = {
        id: `temp-${uuidv4()}`,
        date: new Date().toISOString(),
        ...newTransaction
      };
      
      queryClient.setQueryData(['transactions'], old => 
        [optimisticTransaction, ...(old || [])]
      );
      
      // If this affects user balance, update it optimistically
      let rollbackBalance = null;
      if (newTransaction.amount && !newTransaction.isScheduled) {
        // For outgoing transactions (negative amount)
        const amount = -Math.abs(newTransaction.amount);
        rollbackBalance = updateBalance(amount, true);
      }
      
      // Return a context object with the snapshotted value
      return { previousTransactions, rollbackBalance };
    },
    onError: (err, newTransaction, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions);
      }
      
      // Roll back balance update if needed
      if (context?.rollbackBalance) {
        context.rollbackBalance();
      }
    },
    onSettled: () => {
      // Invalidate and refetch to ensure our local data is in sync with the server
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
  
  // Delete transaction mutation
  const deleteTransaction = useMutation({
    mutationFn: async (transactionId) => {
      // Simulate API call
      await simulateApiCall({ id: transactionId });
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['transactions']) || [];
      const updatedData = currentData.filter(t => t.id !== transactionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return transactionId;
    },
    onMutate: async (transactionId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      
      // Snapshot the previous value
      const previousTransactions = queryClient.getQueryData(['transactions']);
      
      // Find the transaction to be deleted (for potential balance restoration)
      const transactionToDelete = previousTransactions?.find(t => t.id === transactionId);
      
      // Optimistically update the cache
      queryClient.setQueryData(['transactions'], old => 
        old ? old.filter(t => t.id !== transactionId) : []
      );
      
      // If this affects user balance, update it optimistically
      let rollbackBalance = null;
      if (transactionToDelete?.amount && transactionToDelete.status === 'Berhasil') {
        // For deleted outgoing transactions, restore the balance
        rollbackBalance = updateBalance(Math.abs(transactionToDelete.amount), true);
      }
      
      return { previousTransactions, rollbackBalance };
    },
    onError: (err, transactionId, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions);
      }
      
      // Roll back balance update if needed
      if (context?.rollbackBalance) {
        context.rollbackBalance();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
  
  // Filter transactions by date range
  const filterByDateRange = useCallback((startDate, endDate) => {
    if (!startDate && !endDate) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = dayjs(transaction.date);
      if (startDate && endDate) {
        return transactionDate.isAfter(startDate) && transactionDate.isBefore(endDate);
      } else if (startDate) {
        return transactionDate.isAfter(startDate);
      } else {
        return transactionDate.isBefore(endDate);
      }
    });
  }, [transactions]);
  
  // Get transactions stats
  const getTransactionStats = useCallback(() => {
    if (!transactions.length) return { total: 0, success: 0, pending: 0, failed: 0, totalAmount: 0 };
    
    const stats = {
      total: transactions.length,
      success: transactions.filter(t => t.status === 'Berhasil').length,
      pending: transactions.filter(t => t.status === 'Pending').length,
      failed: transactions.filter(t => t.status === 'Gagal').length,
      scheduled: transactions.filter(t => t.status === 'Terjadwal').length,
      totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    };
    
    return stats;
  }, [transactions]);
  
  return {
    transactions,
    isLoading,
    isError,
    error,
    refetch,
    addTransaction,
    deleteTransaction,
    filterByDateRange,
    getTransactionStats
  };
};

export default useTransactions;