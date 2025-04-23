import React, { useState } from 'react';
import { dummyUser, transaksiList } from '../../Data/Dummy';
import TransferForm from './Components/TransferForm';
import TransactionList from './Components/TransactionList';
import Swal from 'sweetalert2';

const TransferPage = () => {
  const [transactions, setTransactions] = useState(transaksiList);
  const [user, setUser] = useState({ ...dummyUser });
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleAddTransaction = (newTransaction) => {
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    setUser((prevUser) => ({
      ...prevUser,
      saldo: prevUser.saldo - newTransaction.nominal,
    }));
    Swal.fire({
      title: 'Transfer Berhasil',
      text: 'Transaksi Anda telah berhasil dilakukan!',
      icon: 'success',
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
    </div>
  );
};

export default TransferPage;
