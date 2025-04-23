import React from 'react';

const TransactionCard = ({ transaction }) => {
  return (
    <div className="bg-white shadow p-4 rounded mb-4">
      <h4 className="font-semibold">Tanggal: {transaction.tanggal}</h4>
      <p><strong>Rekening Tujuan:</strong> {transaction.tujuan}</p>
      <p><strong>Nominal:</strong> Rp {transaction.nominal.toLocaleString()}</p>
      {transaction.catatan && <p><strong>Pesan:</strong> {transaction.catatan}</p>}
    </div>
  );
};

export default TransactionCard;
