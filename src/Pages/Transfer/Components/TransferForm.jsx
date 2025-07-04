import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TransferForm = ({ onClose, onAddTransaction, saldo, savedAccounts, templates, onSaveTemplate }) => {
  const [rekening, setRekening] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [nominal, setNominal] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [scheduleTransfer, setScheduleTransfer] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);

  // Handle template selection
  useEffect(() => {
    if (selectedTemplate && templates && templates.length > 0) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setRekening(template.rekening);
        setSelectedAccount(template.selectedAccount);
        setNominal(template.nominal);
        setPesan(template.pesan);
      }
    }
  }, [selectedTemplate, templates]);

  // Handle saved account selection
  const handleAccountSelect = (account) => {
    if (account) {
      setRekening(account.accountNumber);
      setSelectedAccount(account);
    }
  };

  const handleSubmit = () => {
    // Validasi input
    if ((!rekening && !selectedAccount) || nominal < 1000 || nominal > saldo) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Pastikan semua input valid dan saldo mencukupi!',
        icon: 'error',
        confirmButtonText: 'Tutup',
      });
      return;
    }

    // Show confirmation modal instead of proceeding directly
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setLoading(true);

    // Save as template if option is selected
    if (saveAsTemplate && templateName.trim() !== '') {
      const newTemplate = {
        id: `TMPL${Date.now()}`,
        name: templateName,
        rekening,
        selectedAccount,
        nominal,
        pesan,
      };
      onSaveTemplate(newTemplate);
    }

    // Simulate loading 2 detik
    setTimeout(() => {
      const newTransaction = {
        id: `TRX${Date.now()}`,
        tanggal: new Date().toLocaleDateString(),
        tujuan: selectedAccount ? selectedAccount.name : rekening,
        rekeningTujuan: rekening,
        bank: selectedAccount ? selectedAccount.bank : 'Unknown',
        nominal: parseInt(nominal),
        catatan: pesan,
        status: scheduleTransfer ? 'Terjadwal' : 'Berhasil',
        scheduledDate: scheduleTransfer ? scheduledDate.toISOString() : null,
      };

      console.log('Adding new transaction:', newTransaction);
      onAddTransaction(newTransaction, scheduleTransfer); // Mengirimkan transaksi baru ke parent
      setShowConfirmation(false);
      onClose();
      setLoading(false);

      // Show receipt after successful transfer
      if (!scheduleTransfer) {
        showReceipt(newTransaction);
      } else {
        Swal.fire({
          title: 'Transfer Terjadwal',
          text: `Transfer akan dijalankan pada ${scheduledDate.toLocaleDateString()}`,
          icon: 'success',
          confirmButtonText: 'Tutup',
        });
      }
    }, 2000);
  };

  const showReceipt = (transaction) => {
    // Generate receipt HTML
    const receiptHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="text-align: center; color: #2563eb;">Bukti Transfer</h2>
        <div style="margin-top: 20px; border-top: 1px dashed #ddd; padding-top: 20px;">
          <p><strong>ID Transaksi:</strong> ${transaction.id}</p>
          <p><strong>Tanggal:</strong> ${transaction.tanggal}</p>
          <p><strong>Tujuan:</strong> ${transaction.tujuan}</p>
          <p><strong>Bank:</strong> ${transaction.bank}</p>
          <p><strong>No. Rekening:</strong> ${transaction.rekeningTujuan}</p>
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
      title: 'Transfer Berhasil',
      html: receiptHTML,
      icon: 'success',
      confirmButtonText: 'Tutup',
      width: '500px',
      showCloseButton: false,
      showCancelButton: false,
      cancelButtonText: null
    });
  };

  const ConfirmationModal = () => {
    if (!showConfirmation) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-center">Konfirmasi Transfer</h2>
          
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tujuan:</span>
              <span className="font-semibold">{selectedAccount ? selectedAccount.name : "Rekening Manual"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Bank:</span>
              <span className="font-semibold">{selectedAccount ? selectedAccount.bank : "Unknown"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">No. Rekening:</span>
              <span className="font-semibold">{rekening}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Nominal:</span>
              <span className="font-semibold">Rp {parseInt(nominal).toLocaleString('id-ID')}</span>
            </div>
            {pesan && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Catatan:</span>
                <span className="font-semibold">{pesan}</span>
              </div>
            )}
            {scheduleTransfer && scheduledDate && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Tanggal Transfer:</span>
                <span className="font-semibold">{scheduledDate.toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Konfirmasi Transfer"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Form Transfer</h2>
        
        {/* Template Selection */}
        {templates && templates.length > 0 && (
          <div className="mb-4">
            <label htmlFor="template" className="block text-sm font-semibold mb-2">
              Gunakan Template
            </label>
            <select
              id="template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">-- Pilih Template --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Favorite Account Selection */}
        <div className="mb-4">
          <label htmlFor="savedAccount" className="block text-sm font-semibold mb-2">
            Pilih Rekening Favorit
          </label>
          <select
            id="savedAccount"
            value={selectedAccount ? selectedAccount.id : ""}
            onChange={(e) => {
              const selected = savedAccounts.find(acc => acc.id === e.target.value);
              handleAccountSelect(selected);
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Pilih Rekening --</option>
            {savedAccounts && savedAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} - {account.bank} ({account.accountNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Manual Account Entry */}
        <div className="mb-4">
          <label htmlFor="rekening" className="block text-sm font-semibold mb-2">
            Nomor Rekening Tujuan
          </label>
          <input
            id="rekening"
            type="text"
            value={rekening}
            onChange={(e) => setRekening(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Masukkan nomor rekening tujuan"
          />
        </div>

        {/* Transfer Amount */}
        <div className="mb-4">
          <label htmlFor="nominal" className="block text-sm font-semibold mb-2">
            Nominal
          </label>
          <input
            id="nominal"
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Masukkan nominal transfer"
            min="1000"
          />
          <p className="text-sm text-gray-500 mt-1">
            Saldo Anda: Rp {saldo.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label htmlFor="pesan" className="block text-sm font-semibold mb-2">
            Pesan (Opsional)
          </label>
          <textarea
            id="pesan"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Masukkan pesan (opsional)"
          ></textarea>
        </div>

        {/* Schedule Transfer Option */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={scheduleTransfer}
              onChange={() => setScheduleTransfer(!scheduleTransfer)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-sm font-semibold">Jadwalkan Transfer</span>
          </label>
          
          {scheduleTransfer && (
            <div className="mt-2">
              <DatePicker
                selected={scheduledDate}
                onChange={(date) => setScheduledDate(date)}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="w-full border p-2 rounded"
                placeholderText="Pilih tanggal transfer"
                required
              />
            </div>
          )}
        </div>

        {/* Save as Template Option */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={saveAsTemplate}
              onChange={() => setSaveAsTemplate(!saveAsTemplate)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-sm font-semibold">Simpan sebagai Template</span>
          </label>
          
          {saveAsTemplate && (
            <div className="mt-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Nama template"
                required
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Transfer'}
          </button>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal />
      </div>
    </div>
  );
};

export default TransferForm;
