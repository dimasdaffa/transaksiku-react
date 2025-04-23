import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Heading = ({ name }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin logout?',
      text: 'Kamu akan keluar dari akun ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Logout!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isLoggedIn');
        Swal.fire('Berhasil Logout!', '', 'success');
        navigate('/'); // Arahkan ke halaman login
      }
    });
  };

  return (
    <nav className="bg-blue-600 text-white py-4 px-6 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Transaksiku</h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="font-semibold">{name}</div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Heading;
