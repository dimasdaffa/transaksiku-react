import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4 h-screen">
      <nav>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center p-3 rounded ${
              isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
            }`
          }
        >
          <span className="ml-2">📊 Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/rekening"
          className={({ isActive }) =>
            `flex items-center p-3 rounded mt-2 ${
              isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
            }`
          }
        >
          <span className="ml-2">💳 Rekening</span>
        </NavLink>
        
        <NavLink
          to="/admin/laporan"
          className={({ isActive }) =>
            `flex items-center p-3 rounded mt-2 ${
              isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
            }`
          }
        >
          <span className="ml-2">📝 Laporan</span>
        </NavLink>

        <NavLink
          to="/admin/transfer"
          className={({ isActive }) =>
            `flex items-center p-3 rounded mt-2 ${
              isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
            }`
          }
        >
          <span className="ml-2">💸 Transfer</span>
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center p-3 rounded mt-2 ${
              isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
            }`
          }
        >
          <span className="ml-2">⚙️ Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
