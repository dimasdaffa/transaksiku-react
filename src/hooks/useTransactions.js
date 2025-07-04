import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactions as dummyTransactions } from '../utils/dummyData';
import { useUser } from '../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

const STORAGE_KEY = 'transactions_data';

const simulateApiCall = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const useTransactions = () => {
  const { updateBalance } = useUser();
  const queryClient = useQueryClient();
  
  const fetchTransactions = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyTransactions));
    return dummyTransactions;
  };
  
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
  
  const addTransaction = useMutation({
    mutationFn: async (newTransaction) => {
      const transaction = {
        id: newTransaction.id || `TRX${Date.now()}`,
        date: newTransaction.date || new Date().toISOString(),
        ...newTransaction
      };
      
      await simulateApiCall(transaction);
      
      const currentData = queryClient.getQueryData(['transactions']) || [];
      const updatedData = [transaction, ...currentData];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return transaction;
    },
    onMutate: async (newTransaction) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      
      const previousTransactions = queryClient.getQueryData(['transactions']);
      
      const optimisticTransaction = {
        id: `temp-${uuidv4()}`,
        date: new Date().toISOString(),
        ...newTransaction
      };
      
      queryClient.setQueryData(['transactions'], old => 
        [optimisticTransaction, ...(old || [])]
      );
      
      let rollbackBalance = null;
      if (newTransaction.amount && !newTransaction.isScheduled) {
        const amount = -Math.abs(newTransaction.amount);
        rollbackBalance = updateBalance(amount, true);
      }
      
      return { previousTransactions, rollbackBalance };
    },
    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions);
      }
      
      if (context?.rollbackBalance) {
        context.rollbackBalance();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
  
  const deleteTransaction = useMutation({
    mutationFn: async (transactionId) => {
      await simulateApiCall({ id: transactionId });
      
      const currentData = queryClient.getQueryData(['transactions']) || [];
      const updatedData = currentData.filter(t => t.id !== transactionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return transactionId;
    },
    onMutate: async (transactionId) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      
      const previousTransactions = queryClient.getQueryData(['transactions']);
      
      const transactionToDelete = previousTransactions?.find(t => t.id === transactionId);
      
      queryClient.setQueryData(['transactions'], old => 
        old ? old.filter(t => t.id !== transactionId) : []
      );
      
      let rollbackBalance = null;
      if (transactionToDelete?.amount && transactionToDelete.status === 'Berhasil') {
        rollbackBalance = updateBalance(Math.abs(transactionToDelete.amount), true);
      }
      
      return { previousTransactions, rollbackBalance };
    },
    onError: (err, transactionId, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(['transactions'], context.previousTransactions);
      }
      
      if (context?.rollbackBalance) {
        context.rollbackBalance();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
  
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