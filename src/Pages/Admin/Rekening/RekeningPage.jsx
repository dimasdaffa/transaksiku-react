import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { generateRekeningData } from '../../../Data/RekeningData';
import RekeningList from './Components/RekeningList';
import RekeningForm from './Components/RekeningForm';
import SearchFilter from './Components/SearchFilter';
import BulkActions from './Components/BulkActions';
import Pagination from './Components/Pagination';

// Simulate API calls with delays
const fetchAccounts = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // Load from localStorage or generate new data if not exists
  const savedAccounts = localStorage.getItem('transaksiku_accounts');
  if (savedAccounts) {
    return JSON.parse(savedAccounts);
  }
  const generatedData = generateRekeningData();
  localStorage.setItem('transaksiku_accounts', JSON.stringify(generatedData));
  return generatedData;
};

const RekeningPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBank, setFilterBank] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });
  
  const itemsPerPage = 8;
  const queryClient = useQueryClient();

  // React Query for fetching accounts
  const { data: accounts = [], isLoading, isError } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts
  });

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Create account mutation
  const createMutation = useMutation({
    mutationFn: async (newAccount) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      const createdAccount = { ...newAccount, id: uuidv4(), createdAt: new Date().toISOString() };
      
      // Update local storage
      const currentAccounts = queryClient.getQueryData(['accounts']) || [];
      const updatedAccounts = [...currentAccounts, createdAccount];
      localStorage.setItem('transaksiku_accounts', JSON.stringify(updatedAccounts));
      
      return createdAccount;
    },
    onSuccess: (newAccount) => {
      queryClient.setQueryData(['accounts'], (oldData = []) => [...oldData, newAccount]);
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Rekening berhasil ditambahkan',
        timer: 1500
      });
    }
  });

  // Update account mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedAccount) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Update local storage
      const currentAccounts = queryClient.getQueryData(['accounts']) || [];
      const updatedAccounts = currentAccounts.map(account => 
        account.id === updatedAccount.id ? updatedAccount : account
      );
      localStorage.setItem('transaksiku_accounts', JSON.stringify(updatedAccounts));
      
      return updatedAccount;
    },
    onSuccess: (updatedAccount) => {
      queryClient.setQueryData(['accounts'], (oldData = []) => 
        oldData.map(account => account.id === updatedAccount.id ? updatedAccount : account)
      );
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Rekening berhasil diperbarui',
        timer: 1500
      });
    }
  });

  // Delete account mutation
  const deleteMutation = useMutation({
    mutationFn: async (accountId) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Update local storage
      const currentAccounts = queryClient.getQueryData(['accounts']) || [];
      const updatedAccounts = currentAccounts.filter(account => account.id !== accountId);
      localStorage.setItem('transaksiku_accounts', JSON.stringify(updatedAccounts));
      
      return accountId;
    },
    onSuccess: (accountId) => {
      queryClient.setQueryData(['accounts'], (oldData = []) => 
        oldData.filter(account => account.id !== accountId)
      );
    }
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (accountIds) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Update local storage
      const currentAccounts = queryClient.getQueryData(['accounts']) || [];
      const updatedAccounts = currentAccounts.filter(account => !accountIds.includes(account.id));
      localStorage.setItem('transaksiku_accounts', JSON.stringify(updatedAccounts));
      
      return accountIds;
    },
    onSuccess: (accountIds) => {
      queryClient.setQueryData(['accounts'], (oldData = []) => 
        oldData.filter(account => !accountIds.includes(account.id))
      );
      setSelectedAccounts([]);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: `${accountIds.length} rekening berhasil dihapus`,
        timer: 1500
      });
    }
  });

  // Handle adding a new account
  const handleAddAccount = (account) => {
    createMutation.mutate(account);
  };

  // Handle updating an account
  const handleUpdateAccount = (account) => {
    updateMutation.mutate(account);
  };

  // Handle deleting an account with confirmation
  const handleDeleteAccount = (accountId) => {
    Swal.fire({
      title: 'Hapus Rekening',
      text: 'Apakah Anda yakin ingin menghapus rekening ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(accountId);
        Swal.fire(
          'Terhapus!',
          'Rekening berhasil dihapus.',
          'success'
        );
      }
    });
  };

  // Handle bulk delete with confirmation
  const handleBulkDelete = () => {
    if (selectedAccounts.length === 0) return;
    
    Swal.fire({
      title: 'Hapus Rekening',
      text: `Apakah Anda yakin ingin menghapus ${selectedAccounts.length} rekening terpilih?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus Semua',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        bulkDeleteMutation.mutate(selectedAccounts);
      }
    });
  };

  // Handle selecting/deselecting all accounts
  const handleSelectAll = (checked) => {
    if (checked) {
      const allVisibleIds = filteredAccounts.map(account => account.id);
      setSelectedAccounts(allVisibleIds);
    } else {
      setSelectedAccounts([]);
    }
  };

  // Handle selecting/deselecting a single account
  const handleSelectAccount = (accountId, checked) => {
    if (checked) {
      setSelectedAccounts(prev => [...prev, accountId]);
    } else {
      setSelectedAccounts(prev => prev.filter(id => id !== accountId));
    }
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  // Filter accounts based on search term and bank filter
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                          account.accountNumber.includes(debouncedSearchTerm);
    const matchesBank = filterBank ? account.bank === filterBank : true;
    return matchesSearch && matchesBank;
  });

  // Sort accounts based on the current sortConfig
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc' 
        ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
        : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAccounts = sortedAccounts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique banks for filtering
  const uniqueBanks = [...new Set(accounts.map(account => account.bank))];
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Manajemen Rekening</h1>
      
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => {
              setCurrentAccount(null);
              setShowModal(true);
            }}
          >
            <span className="mr-1">+</span> Tambah Rekening
          </button>
          
          <BulkActions 
            selectedCount={selectedAccounts.length} 
            onBulkDelete={handleBulkDelete}
          />
        </div>
        
        <SearchFilter 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterBank={filterBank}
          onFilterChange={setFilterBank}
          banks={uniqueBanks}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Terjadi kesalahan saat memuat data. Silakan coba lagi.
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Tidak ada rekening yang sesuai dengan pencarian Anda.
        </div>
      ) : (
        <>
          <RekeningList 
            accounts={paginatedAccounts}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={(account) => {
              setCurrentAccount(account);
              setShowModal(true);
            }}
            onDelete={handleDeleteAccount}
            selectedAccounts={selectedAccounts}
            onSelectAccount={handleSelectAccount}
            onSelectAll={handleSelectAll}
          />
          
          <div className="mt-4">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
      
      {showModal && (
        <RekeningForm
          account={currentAccount}
          existingAccounts={accounts}
          onSave={currentAccount ? handleUpdateAccount : handleAddAccount}
          onCancel={() => setShowModal(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};

export default RekeningPage;