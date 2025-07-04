import React from 'react';

const BulkActions = ({ selectedCount, onBulkDelete }) => {
  if (selectedCount === 0) {
    return null;
  }
  
  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
      onClick={onBulkDelete}
    >
      <span className="mr-1">🗑️</span> Hapus {selectedCount} Rekening
    </button>
  );
};

export default BulkActions;