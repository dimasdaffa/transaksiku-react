import React, { useState, useEffect } from 'react';
import { dummyUser, transaksiList } from '../../Data/Dummy';
import TransferForm from './Components/TransferForm';
import TransactionList from './Components/TransactionList';
import Swal from 'sweetalert2';
import { UserBalance } from './Components/UserBalance';
import { generateRekeningData } from '../../Data/RekeningData';

const TransferPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [scheduledTransactions, setScheduledTransactions] = useState([]);
  const [user, setUser] = useState({ ...dummyUser });
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    console.log("TransferPage - Loading data from localStorage");
    
    // Load transactions
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        console.log("Loaded transactions:", parsedTransactions);
        setTransactions(parsedTransactions);
      } catch (error) {
        console.error("Error parsing transactions:", error);
        setTransactions(transaksiList);
      }
    } else {
      console.log("No saved transactions, using dummy data");
      setTransactions(transaksiList);
      // Save dummy data to localStorage so it's available next time
      localStorage.setItem('transactions', JSON.stringify(transaksiList));
    }

    // Load scheduled transactions
    const savedScheduledTransactions = localStorage.getItem('scheduledTransactions');
    if (savedScheduledTransactions) {
      try {
        setScheduledTransactions(JSON.parse(savedScheduledTransactions));
      } catch (error) {
        console.error("Error parsing scheduled transactions:", error);
        setScheduledTransactions([]);
      }
    }

    // Load user data and balance
    const savedSaldo = localStorage.getItem('saldo');
    if (savedSaldo) {
      setUser(prevUser => ({ ...prevUser, saldo: parseInt(savedSaldo) }));
    } else {
      // If no saved balance, use the dummy user's balance and save it
      localStorage.setItem('saldo', dummyUser.saldo);
    }

    // Load saved accounts from RekeningData
    const accounts = generateRekeningData();
    setSavedAccounts(accounts);

    // Load templates
    const savedTemplates = localStorage.getItem('transferTemplates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Error parsing templates:", error);
        setTemplates([]);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions && transactions.length >= 0) {
      console.log("Saving transactions to localStorage:", transactions);
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  // Save scheduled transactions to localStorage whenever they change
  useEffect(() => {
    if (scheduledTransactions && scheduledTransactions.length >= 0) {
      localStorage.setItem('scheduledTransactions', JSON.stringify(scheduledTransactions));
    }
  }, [scheduledTransactions]);

  // Save templates to localStorage whenever they change
  useEffect(() => {
    if (templates && templates.length >= 0) {
      localStorage.setItem('transferTemplates', JSON.stringify(templates));
    }
  }, [templates]);

  const handleAddTransaction = (newTransaction, isScheduled = false) => {
    console.log("Adding new transaction:", newTransaction, "isScheduled:", isScheduled);
    
    if (isScheduled) {
      // Add to scheduled transactions
      setScheduledTransactions(prev => {
        const updated = [...prev, newTransaction];
        console.log("Updated scheduled transactions:", updated);
        return updated;
      });
    } else {
      // Add to regular transactions and deduct balance
      setTransactions(prev => {
        const updated = [newTransaction, ...(prev || [])];
        console.log("Updated transactions:", updated);
        return updated;
      });
      
      setUser((prevUser) => {
        const updatedUser = {
          ...prevUser,
          saldo: prevUser.saldo - newTransaction.nominal,
        };
        
        // Save updated balance to localStorage
        localStorage.setItem('saldo', updatedUser.saldo);
        return updatedUser;
      });
    }
  };

  const handleSaveTemplate = (newTemplate) => {
    setTemplates(prev => [...(prev || []), newTemplate]);
  };
  
  const handleClearTransactions = () => {
    Swal.fire({
      title: 'Yakin ingin menghapus semua transaksi?',
      text: "Tindakan ini tidak bisa dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus semua!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setTransactions([]);
        setScheduledTransactions([]);
        
        // Reset saldo to initial value
        setUser((prevUser) => {
          const updatedUser = { ...prevUser, saldo: dummyUser.saldo };
          localStorage.setItem('saldo', updatedUser.saldo);
          return updatedUser;
        });
  
        // Clear localStorage items
        localStorage.removeItem('transactions');
        localStorage.removeItem('scheduledTransactions');
  
        Swal.fire(
          'Berhasil!',
          'Semua transaksi telah dihapus.',
          'success'
        );
      }
    });
  };

  // Combine regular and scheduled transactions for display
  const allTransactions = [...(transactions || []), ...(scheduledTransactions || [])];
  console.log("Combined transactions for display:", allTransactions);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transfer</h2>
      
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowTransferModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Transfer
        </button>
        
        <button
          onClick={handleClearTransactions}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Hapus Semua
        </button>

        {templates && templates.length > 0 && (
          <button 
            onClick={() => {
              Swal.fire({
                title: 'Template Transfer',
                html: `
                  <div class="text-left">
                    <ul class="mt-4 space-y-2">
                      ${templates.map((template, index) => `
                        <li class="p-2 border rounded hover:bg-gray-100">
                          <strong>${template.name}</strong><br>
                          <span class="text-sm text-gray-600">Tujuan: ${template.selectedAccount ? template.selectedAccount.name : template.rekening}</span><br>
                          <span class="text-sm text-gray-600">Nominal: Rp${parseInt(template.nominal).toLocaleString('id-ID')}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                `,
                confirmButtonText: 'Tutup',
              });
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Template Transfer
          </button>
        )}
      </div>

      {/* User Balance */}
      <div className="mb-6">
        <UserBalance saldo={user.saldo} />
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferForm
          onClose={() => setShowTransferModal(false)}
          onAddTransaction={handleAddTransaction}
          onSaveTemplate={handleSaveTemplate}
          saldo={user.saldo}
          savedAccounts={savedAccounts}
          templates={templates}
        />
      )}

      {/* Transaction List */}
      <div className="mt-6">
        <TransactionList transactions={allTransactions} />
      </div>
    </div>
  );
};

export default TransferPage;
