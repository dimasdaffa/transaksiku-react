import React, { useState } from 'react';
import Swal from 'sweetalert2';

const TransferForm = ({ onClose, onAddTransaction, saldo }) => {
  const [rekening, setRekening] = useState('');
  const [nominal, setNominal] = useState('');
  const [pesan, setPesan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    // Validasi input
    if (!rekening || nominal < 1000 || nominal > saldo) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Pastikan semua input valid dan saldo mencukupi!',
        icon: 'error',
        confirmButtonText: 'Tutup',
      });
      return;
    }

    setLoading(true);

    // Simulasi loading 2 detik
    setTimeout(() => {
      const newTransaction = {
        id: `TRX${Date.now()}`,
        tanggal: new Date().toLocaleDateString(),
        tujuan: rekening,
        nominal: parseInt(nominal),
        catatan: pesan,
        status: 'Berhasil',
      };

      onAddTransaction(newTransaction); // Mengirimkan transaksi baru ke parent
      onClose();
      setLoading(false);

      Swal.fire({
        title: 'Transfer Berhasil',
        text: 'Transaksi Anda telah berhasil dilakukan!',
        icon: 'success',
        confirmButtonText: 'Tutup',
      });
    }, 2000);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Form Transfer</h2>
        <div className="mb-4">
          <label htmlFor="rekening" className="block text-sm font-semibold">
            Nomor Rekening Tujuan
          </label>
          <input
            id="rekening"
            type="text"
            value={rekening}
            onChange={(e) => setRekening(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            placeholder="Masukkan nomor rekening tujuan"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nominal" className="block text-sm font-semibold">
            Nominal
          </label>
          <input
            id="nominal"
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            placeholder="Masukkan nominal transfer"
            min="1000"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="pesan" className="block text-sm font-semibold">
            Pesan (Opsional)
          </label>
          <textarea
            id="pesan"
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            placeholder="Masukkan pesan (opsional)"
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;
