import React, { useState } from 'react';
import { dummyUser, transaksiList } from '../../Data/Dummy';
import TransferForm from './Components/TransferForm';
import TransactionList from './Components/TransactionList';
import Swal from 'sweetalert2';
import { UserBalance } from './Components/UserBalance';

const TransferPage = () => {
  const [transactions, setTransactions] = useState(transaksiList);
  const [user, setUser] = useState({ ...dummyUser });
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    setUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        saldo: prevUser.saldo - newTransaction.nominal,
      };
      
      // Simpan saldo di localStorage
      localStorage.setItem('saldo', updatedUser.saldo);
      return updatedUser;
    });
  
    Swal.fire({
      title: 'Transfer Berhasil',
      text: 'Transaksi Anda telah berhasil dilakukan!',
      icon: 'success',
    });
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
        // Reset saldo juga jika diperlukan, misalnya ke saldo awal:
        setUser((prevUser) => {
          const updatedUser = { ...prevUser, saldo: dummyUser.saldo };
          localStorage.setItem('saldo', updatedUser.saldo);
          return updatedUser;
        });
  
        Swal.fire(
          'Berhasil!',
          'Semua transaksi telah dihapus.',
          'success'
        );
      }
    });
  };
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Transfer</h2>
      
      <button
        onClick={() => setShowTransferModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Tambah Transaksi
      </button>
      <button
    onClick={handleClearTransactions}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Hapus Semua
  </button>

      {/* Modal Transfer */}
      {showTransferModal && (
        <TransferForm
          onClose={() => setShowTransferModal(false)}
          onAddTransaction={handleAddTransaction}
          saldo={user.saldo}
        />
      )}

      {/* Daftar Transaksi */}
      <div className="mt-6">
        <TransactionList transactions={transactions} />
      </div>
      <UserBalance saldo={user.saldo} />
    </div>
  );
};

export default TransferPage;
