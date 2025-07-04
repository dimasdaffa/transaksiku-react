import React, { useState } from 'react';
import TransactionCard from './TransactionCard';

const TransactionList = ({ transactions }) => {
  const [filter, setFilter] = useState('all');
  
  console.log('TransactionList received transactions:', transactions);
  
  const filteredTransactions = transactions ? transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'scheduled') return transaction.status === 'Terjadwal';
    if (filter === 'completed') return transaction.status === 'Berhasil';
    return true;
  }) : [];

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Daftar Transaksi</h3>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            Semua
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('completed')}
          >
            Selesai
          </button>
          <button 
            className={`px-3 py-1 rounded text-sm ${filter === 'scheduled' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter('scheduled')}
          >
            Terjadwal
          </button>
        </div>
      </div>
      
      {filteredTransactions && filteredTransactions.length > 0 ? (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
          Tidak ada transaksi yang ditemukan.
        </div>
      )}
    </div>
  );
};

export default TransactionList;
