import React from 'react';
import Button from '../../Components/Button';
import { dummyUser } from '../../Data/Dummy.js';

const Login = () => {

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Periksa apakah email dan password cocok dengan data dummyUser
    if (dummyUser.email === email && dummyUser.password === password) {
      // Simpan data user ke localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      // Hapus password dari data yang disimpan untuk keamanan
      const { password, ...userWithoutPassword } = dummyUser;
      localStorage.setItem('userData', JSON.stringify(userWithoutPassword));
      alert('Login berhasil!');

      // Arahkan ke dashboard
    } else {
      alert('Email atau password salah!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-700">Ingat Saya</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Lupa Password
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-700 mt-4">
            Belum punya akun?
            <a href="#" className="text-blue-600 hover:underline ml-1">
              Daftar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
