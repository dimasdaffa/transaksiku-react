import React, { useState } from 'react';
import Card from '../../../../Components/Card';
import Swal from 'sweetalert2';

const SecuritySettings = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy active sessions data
  const activeSessions = [
    {
      id: 'sess_1',
      device: 'Chrome on Windows',
      location: 'Jakarta, Indonesia',
      ip: '103.122.xxx.xxx',
      lastActive: '10 menit yang lalu',
      current: true
    },
    {
      id: 'sess_2',
      device: 'Safari on macOS',
      location: 'Surabaya, Indonesia',
      ip: '36.85.xxx.xxx',
      lastActive: '2 jam yang lalu',
      current: false
    },
    {
      id: 'sess_3',
      device: 'Chrome on Android',
      location: 'Bandung, Indonesia',
      ip: '112.215.xxx.xxx',
      lastActive: '1 hari yang lalu',
      current: false
    }
  ];
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Swal.fire({
        title: 'Terjadi Kesalahan',
        text: 'Password baru dan konfirmasi password tidak cocok',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      Swal.fire({
        title: 'Terjadi Kesalahan',
        text: 'Password baru harus minimal 6 karakter',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Password berhasil diubah',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    }, 1000);
  };
  
  const toggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    
    if (!twoFactorEnabled) {
      // Show 2FA setup mock
      Swal.fire({
        title: 'Setup 2FA',
        html: `
          <div class="text-left">
            <p>Scan QR code ini dengan Google Authenticator atau aplikasi 2FA lainnya</p>
            <div class="flex justify-center my-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="QR Code" class="w-48 h-48" />
            </div>
            <p>Atau gunakan kode berikut: <strong>ABCD-EFGH-IJKL-MNOP</strong></p>
          </div>
        `,
        confirmButtonText: 'Selesai'
      });
    }
  };
  
  const handleTerminateSession = (sessionId) => {
    Swal.fire({
      title: 'Akhiri Sesi?',
      text: 'Apakah Anda yakin ingin mengakhiri sesi ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Akhiri',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Berhasil!',
          'Sesi berhasil diakhiri',
          'success'
        );
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Change Password */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ganti Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Password Saat Ini</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Password Baru</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Konfirmasi Password Baru</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                'Ubah Password'
              )}
            </button>
          </form>
        </div>
      </Card>
      
      {/* Two Factor Authentication */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Autentikasi Dua Faktor</h3>
          <p className="text-sm text-gray-600">
            Aktifkan autentikasi dua faktor untuk menambahkan lapisan keamanan tambahan pada akun Anda.
          </p>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Status 2FA</span>
            <div className="flex items-center">
              <span className="mr-2 text-sm">
                {twoFactorEnabled ? 'Aktif' : 'Nonaktif'}
              </span>
              <button
                onClick={toggle2FA}
                className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
                  twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className="sr-only">Toggle 2FA</span>
                <span
                  className={`inline-block w-4 h-4 transform transition rounded-full bg-white ${
                    twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Active Sessions */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sesi Aktif</h3>
          <p className="text-sm text-gray-600">
            Berikut adalah daftar perangkat yang saat ini login ke akun Anda.
          </p>
          
          <div className="space-y-4">
            {activeSessions.map(session => (
              <div key={session.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{session.device}</span>
                    {session.current && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Sesi Ini
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Lokasi: {session.location} ({session.ip})</p>
                    <p>Terakhir aktif: {session.lastActive}</p>
                  </div>
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleTerminateSession(session.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Akhiri Sesi
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecuritySettings;