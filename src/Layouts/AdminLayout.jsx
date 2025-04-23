import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { dummyUser } from '../Data/Dummy';
import Heading from '../Components/Heading';
import { Outlet } from 'react-router-dom';


const AdminLayout = () => {
  const [user] = useState(dummyUser);
  return (
    <div>
      <Heading name={user.name} />
      <div className='flex'>
        <div className='flex flex-1/6 '>
      <Sidebar />
      </div>
      <div className='flex flex-5/6'>
      <Outlet/>
      </div>
      </div>
    </div>
  );
};

export default AdminLayout; 