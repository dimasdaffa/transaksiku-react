import React from 'react';
import Card from '../../../../Components/Card';
import Swal from 'sweetalert2';
import { useUser } from '../../../../context/UserContext';

const AppSettings = () => {
  const { theme, toggleTheme } = useUser();
  
  const handleThemeToggle = () => {
    toggleTheme();
    
    Swal.fire({
      title: 'Berhasil!',
      text: `Tema berhasil diubah ke mode ${theme === 'dark' ? 'Terang' : 'Gelap'}`,
      icon: 'success',
      confirmButtonText: 'OK',
      timer: 1500
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Pengaturan Aplikasi</h2>
        
        <div className="border-b pb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Mode Tampilan</h3>
              <p className="text-sm text-gray-500">
                Pilih mode tampilan aplikasi (terang/gelap)
              </p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm">
                {theme === 'light' ? 'Terang' : 'Gelap'}
              </span>
              <button
                onClick={handleThemeToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={`inline-block w-4 h-4 transform transition rounded-full bg-white ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional app settings can be added here in the future */}
        <div className="text-sm text-gray-500 italic">
          Pengaturan tambahan akan segera tersedia pada versi mendatang.
        </div>
      </div>
    </Card>
  );
};

export default AppSettings;