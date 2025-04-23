import React from 'react';
import TransactionCard from './TransactionCard';

const TransactionList = ({ transactions }) => {
  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg">Daftar Transaksi</h3>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionList;
