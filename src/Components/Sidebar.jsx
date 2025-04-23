import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col p-4 h-screen">
      <nav>
       
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
      </nav>
    </div>
  );
};

export default Sidebar;
