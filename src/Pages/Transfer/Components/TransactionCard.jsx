import React from 'react';
import Swal from 'sweetalert2';

const TransactionCard = ({ transaction }) => {
  // Format date for scheduled transfers
  const formatScheduledDate = () => {
    if (transaction.scheduledDate) {
      const date = new Date(transaction.scheduledDate);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return '';
  };

  // Generate status badge based on transaction status
  const getStatusBadge = () => {
    switch (transaction.status) {
      case 'Berhasil':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Terjadwal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Gagal':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Show receipt when clicked on "Lihat Bukti Transfer"
  const showReceipt = () => {
    // Generate receipt HTML
    const receiptHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 60px; height: 60px; background-color: #ebf7ee; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 style="text-align: center; color: #374151; margin-top: 12px;">Transfer Berhasil</h2>
        </div>
        <div style="margin-top: 20px; border-top: 1px dashed #ddd; padding-top: 20px;">
          <p><strong>ID Transaksi:</strong> ${transaction.id}</p>
          <p><strong>Tanggal:</strong> ${transaction.tanggal}</p>
          <p><strong>Tujuan:</strong> ${transaction.tujuan}</p>
          ${transaction.bank ? `<p><strong>Bank:</strong> ${transaction.bank}</p>` : ''}
          <p><strong>No. Rekening:</strong> ${transaction.rekeningTujuan || transaction.tujuan}</p>
          <p><strong>Nominal:</strong> Rp ${transaction.nominal.toLocaleString('id-ID')}</p>
          ${transaction.catatan ? `<p><strong>Catatan:</strong> ${transaction.catatan}</p>` : ''}
          <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">${transaction.status}</span></p>
        </div>
        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Terima kasih telah menggunakan layanan TransaksiKu</p>
        </div>
      </div>
    `;

    // Show receipt in SweetAlert
    Swal.fire({
      title: 'Bukti Transfer',
      html: receiptHTML,
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#6366f1',
      showCancelButton: false,
      showDenyButton: false,
      showCloseButton: true,
      showDownloadButton: false,
      width: '500px'
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      {/* Header with ID and Status */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
        <p className="text-sm font-medium text-gray-600">ID: {transaction.id}</p>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge()}`}>
          {transaction.status}
        </span>
      </div>

      {/* Main Transaction Info */}
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Tanggal:</span>
          <span className="font-medium">{transaction.tanggal}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Tujuan:</span>
          <span className="font-medium">{transaction.tujuan}</span>
        </div>

        {transaction.bank && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Bank:</span>
            <span className="font-medium">{transaction.bank}</span>
          </div>
        )}

        {transaction.rekeningTujuan && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">No. Rekening:</span>
            <span className="font-medium">{transaction.rekeningTujuan}</span>
          </div>
        )}

        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Nominal:</span>
          <span className="font-semibold text-blue-600">
            Rp {transaction.nominal.toLocaleString('id-ID')}
          </span>
        </div>

        {transaction.catatan && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Catatan:</span>
            <span className="font-medium">{transaction.catatan}</span>
          </div>
        )}

        {transaction.status === 'Terjadwal' && transaction.scheduledDate && (
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Jadwal Transfer:</span>
            <span className="font-medium">{formatScheduledDate()}</span>
          </div>
        )}
      </div>

      {/* Footer with Actions */}
      <div className="px-4 py-3 bg-gray-50 text-right">
        {transaction.status === 'Berhasil' && (
          <button 
            onClick={showReceipt}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Lihat Bukti Transfer
          </button>
        )}
        
        {transaction.status === 'Terjadwal' && (
          <span className="text-xs text-gray-500">
            Transfer akan dijalankan pada jadwal yang ditentukan
          </span>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
