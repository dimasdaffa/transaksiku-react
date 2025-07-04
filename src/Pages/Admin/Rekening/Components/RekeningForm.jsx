import React, { useState, useEffect } from 'react';
import { validateAccount } from '../../../../Data/RekeningData';

const RekeningForm = ({ account, existingAccounts, onSave, onCancel, isLoading }) => {
  const isEditMode = !!account;
  
  const [formData, setFormData] = useState({
    id: account?.id || '',
    name: account?.name || '',
    accountNumber: account?.accountNumber || '',
    bank: account?.bank || '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (account) {
      setFormData({
        id: account.id,
        name: account.name,
        accountNumber: account.accountNumber,
        bank: account.bank,
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const validationErrors = validateAccount(formData, existingAccounts);
    setErrors(validationErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateAccount(formData, existingAccounts);
    setErrors(validationErrors);
    setTouched({
      name: true,
      accountNumber: true,
      bank: true
    });
    
    if (Object.keys(validationErrors).length === 0) {
      onSave(formData);
    }
  };

  const commonBanks = [
    'BCA', 'BRI', 'Mandiri', 'BNI', 'CIMB Niaga', 
    'Bank Permata', 'Bank Syariah Indonesia', 'Bank Danamon',
    'Bank BTN', 'Bank OCBC NISP', 'Panin Bank', 'Bank Mega'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {isEditMode ? 'Edit Rekening' : 'Tambah Rekening Baru'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nama Penerima
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md ${
                touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama penerima"
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nomor Rekening
            </label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md ${
                touched.accountNumber && errors.accountNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nomor rekening"
            />
            {touched.accountNumber && errors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Bank
            </label>
            <select
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md ${
                touched.bank && errors.bank ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Pilih Bank</option>
              {commonBanks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            {touched.bank && errors.bank && (
              <p className="text-red-500 text-xs mt-1">{errors.bank}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  <span>Menyimpan...</span>
                </>
              ) : (
                'Simpan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RekeningForm;