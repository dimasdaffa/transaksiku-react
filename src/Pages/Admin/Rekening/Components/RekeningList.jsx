import React from 'react';
import dayjs from 'dayjs';

const RekeningList = ({
  accounts,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  selectedAccounts,
  onSelectAccount,
  onSelectAll,
}) => {
  // Format the date to a more readable format
  const formatDate = (dateString) => {
    return dayjs(dateString).format('DD MMM YYYY, HH:mm');
  };

  // Check if all visible accounts are selected
  const allSelected = accounts.length > 0 && 
    accounts.every(account => selectedAccounts.includes(account.id));
  
  // Get the sort icon based on current sort configuration
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Nama Penerima
                <span className="ml-1">{getSortIcon('name')}</span>
              </div>
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Nomor Rekening
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort('bank')}
            >
              <div className="flex items-center">
                Bank
                <span className="ml-1">{getSortIcon('bank')}</span>
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
              onClick={() => onSort('createdAt')}
            >
              <div className="flex items-center">
                Tanggal Ditambahkan
                <span className="ml-1">{getSortIcon('createdAt')}</span>
              </div>
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account.id)}
                  onChange={(e) => onSelectAccount(account.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{account.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500 font-mono">{account.accountNumber}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{account.bank}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{formatDate(account.createdAt)}</td>
              <td className="px-4 py-3 text-sm text-right">
                <button
                  onClick={() => onEdit(account)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(account.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RekeningList;