import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedAccounts as dummyAccounts } from '../utils/dummyData';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'accounts_data';

const simulateApiCall = (data, delay = 800) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const useAccounts = () => {
  const queryClient = useQueryClient();
  
  const fetchAccounts = async () => {
    await simulateApiCall(null);
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyAccounts));
    return dummyAccounts;
  };
  
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
  
  const addAccount = useMutation({
    mutationFn: async (newAccount) => {
      const account = {
        id: newAccount.id || uuidv4(),
        createdAt: newAccount.createdAt || new Date().toISOString(),
        ...newAccount
      };
      
      await simulateApiCall(account);
      
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = [...currentData, account];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return account;
    },
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
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
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  const updateAccount = useMutation({
    mutationFn: async (updatedAccount) => {
      await simulateApiCall(updatedAccount);
      
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.map(account => 
        account.id === updatedAccount.id ? updatedAccount : account
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return updatedAccount;
    },
    onMutate: async (updatedAccount) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      queryClient.setQueryData(['accounts'], old => 
        old ? old.map(account => 
          account.id === updatedAccount.id ? updatedAccount : account
        ) : []
      );
      
      return { previousAccounts };
    },
    onError: (err, updatedAccount, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  const deleteAccount = useMutation({
    mutationFn: async (accountId) => {
      await simulateApiCall({ id: accountId });
      
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.filter(a => a.id !== accountId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return accountId;
    },
    onMutate: async (accountId) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      queryClient.setQueryData(['accounts'], old => 
        old ? old.filter(a => a.id !== accountId) : []
      );
      
      return { previousAccounts };
    },
    onError: (err, accountId, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  const bulkDeleteAccounts = useMutation({
    mutationFn: async (accountIds) => {
      await simulateApiCall({ ids: accountIds });
      
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.filter(a => !accountIds.includes(a.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return accountIds;
    },
    onMutate: async (accountIds) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
      queryClient.setQueryData(['accounts'], old => 
        old ? old.filter(a => !accountIds.includes(a.id)) : []
      );
      
      return { previousAccounts };
    },
    onError: (err, accountIds, context) => {
      if (context?.previousAccounts) {
        queryClient.setQueryData(['accounts'], context.previousAccounts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  const getFavoriteAccounts = useCallback(() => {
    return accounts.filter(account => account.isFavorite);
  }, [accounts]);
  
  const toggleFavorite = useMutation({
    mutationFn: async (accountId) => {
      const account = accounts.find(a => a.id === accountId);
      if (!account) throw new Error('Account not found');
      
      const updatedAccount = {
        ...account,
        isFavorite: !account.isFavorite
      };
      
      await simulateApiCall(updatedAccount);
      
      const currentData = queryClient.getQueryData(['accounts']) || [];
      const updatedData = currentData.map(a => 
        a.id === accountId ? updatedAccount : a
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      return updatedAccount;
    },
    onMutate: async (accountId) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      
      const previousAccounts = queryClient.getQueryData(['accounts']);
      
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