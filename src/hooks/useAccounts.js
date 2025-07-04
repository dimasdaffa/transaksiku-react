import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedAccounts as dummyAccounts } from '../utils/dummyData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'accounts_data';

// Helper to simulate API call delay
const simulateApiCall = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const useAccounts = () => {
  const queryClient = useQueryClient();
  
  // Fetch accounts
  const fetchAccounts = async () => {
    // Simulate API delay
    await simulateApiCall(null);
    
    // Try to get from localStorage
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // If not in localStorage, use dummy data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyAccounts));
    return dummyAccounts;
  };
  
  // Query accounts
  const {
    data: accounts = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts
  });
  
  // Add account mutation with optimistic update
  const addAccount = useMutation({
    mutationFn: async (newAccount) => {
      // Generate ID and other fields if not provided
      const account = {
        id: newAccount.id || uuidv4(),
        createdAt: newAccount.createdAt || new Date().toISOString(),
        ...newAccount
      };
      
      // Simulate API call
      await simulateApiCall(account);
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = [...currentData, account];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return account;
    },
    onMutate: async (newAccount) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      // Optimistically update the cache
      const optimisticAccount = {
        id: `temp-${uuidv4()}`,
        createdAt: new Date().toISOString(),
        ...newAccount
      };
      
      queryClient.setQueryData(['accounts'], old => 
        [...(old || []), optimisticAccount]
      );
      
      return { previousAccounts };
    },
    onError: (err, newAccount, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  // Update account mutation
  const updateAccount = useMutation({
    mutationFn: async (updatedAccount) => {
      // Simulate API call
      await simulateApiCall(updatedAccount);
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.map(account => 
        account.id === updatedAccount.id ? updatedAccount : account
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return updatedAccount;
    },
    onMutate: async (updatedAccount) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['accounts'], old => 
        old ? old.map(account => 
          account.id === updatedAccount.id ? updatedAccount : account
        ) : []
      );
      
      return { previousAccounts };
    },
    onError: (err, updatedAccount, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  // Delete account mutation
  const deleteAccount = useMutation({
    mutationFn: async (accountId) => {
      // Simulate API call
      await simulateApiCall({ id: accountId });
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.filter(a => a.id !== accountId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return accountId;
    },
    onMutate: async (accountId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['accounts'], old => 
        old ? old.filter(a => a.id !== accountId) : []
      );
      
      return { previousAccounts };
    },
    onError: (err, accountId, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  // Bulk delete accounts mutation
  const bulkDeleteAccounts = useMutation({
    mutationFn: async (accountIds) => {
      // Simulate API call
      await simulateApiCall({ ids: accountIds });
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.filter(a => !accountIds.includes(a.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return accountIds;
    },
    onMutate: async (accountIds) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      // Optimistically update the cache
      queryClient.setQueryData(['accounts'], old => 
        old ? old.filter(a => !accountIds.includes(a.id)) : []
      );
      
      return { previousAccounts };
    },
    onError: (err, accountIds, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  // Get favorite accounts
  const getFavoriteAccounts = useCallback(() => {
    return accounts.filter(account => account.isFavorite);
  }, [accounts]);
  
  // Toggle favorite status
  const toggleFavorite = useMutation({
    mutationFn: async (accountId) => {
      // Find the account
      const account = accounts.find(a => a.id === accountId);
      if (!account) throw new Error('Account not found');
      
      // Toggle favorite status
      const updatedAccount = {
        ...account,
        isFavorite: !account.isFavorite
      };
      
      // Simulate API call
      await simulateApiCall(updatedAccount);
      
      // Update localStorage
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.map(a => 
        a.id === accountId ? updatedAccount : a
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return updatedAccount;
    },
    onMutate: async (accountId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      // Snapshot the previous value
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      // Find the account and toggle its favorite status optimistically
      queryClient.setQueryData(['accounts'], old => {
        if (!old) return [];
        return old.map(a => {
          if (a.id === accountId) {
            return { ...a, isFavorite: !a.isFavorite };
          }
          return a;
        });
      });
      
      return { previousAccounts };
    },
    onError: (err, accountId, context) => {
      // Roll back to the previous state if there's an error
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  return {
    accounts,
    isLoading,
    isError,
    error,
    refetch,
    addAccount,
    updateAccount,
    deleteAccount,
    bulkDeleteAccounts,
    getFavoriteAccounts,
    toggleFavorite
  };
};

export default useAccounts;