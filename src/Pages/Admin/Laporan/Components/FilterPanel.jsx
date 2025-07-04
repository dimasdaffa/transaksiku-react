import React, { useState } from 'react';
import { STATUS_OPTIONS } from '../../../../Data/TransactionData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleDateRangeChange = (dates) => {
    const [startDate, endDate] = dates;
    onFilterChange({
      dateRange: {
        startDate,
        endDate
      }
    });
  };

  const handleAmountChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      amountRange: {
        ...filters.amountRange,
        [name]: value
      }
    });
  };

  const handleStatusChange = (status) => {
    const currentStatus = [...filters.status];
    if (currentStatus.includes(status)) {
      onFilterChange({ 
        status: currentStatus.filter(s => s !== status) 
      });
    } else {
      onFilterChange({ 
        status: [...currentStatus, status] 
      });
    }
  };

  const handleRecipientChange = (e) => {
    onFilterChange({ recipient: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-lg font-medium">Filter Transaksi</h2>
        <span className="text-xl">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rentang Tanggal
              </label>
              <DatePicker
                selectsRange={true}
                startDate={filters.dateRange.startDate}
                endDate={filters.dateRange.endDate}
                onChange={handleDateRangeChange}
                dateFormat="dd/MM/yyyy"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholderText="Pilih rentang tanggal"
                isClearable
              />
            </div>

            {/* Amount Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rentang Nominal (Rp)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="min"
                  value={filters.amountRange.min}
                  onChange={handleAmountChange}
                  placeholder="Min"
                  className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
                />
                <input
                  type="number"
                  name="max"
                  value={filters.amountRange.max}
                  onChange={handleAmountChange}
                  placeholder="Max"
                  className="w-1/2 border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Transaksi
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.values(STATUS_OPTIONS).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      filters.status.includes(status)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient/Account Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penerima/No. Rekening
              </label>
              <input
                type="text"
                value={filters.recipient}
                onChange={handleRecipientChange}
                placeholder="Cari penerima atau rekening"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>
          </div>
          
          {/* Filter Actions */}
          <div className="flex justify-end mt-2">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;