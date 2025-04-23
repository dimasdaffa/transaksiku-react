import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import { dummyUser } from '../Data/Dummy';
import Heading from '../Components/Heading';


const AdminLayout = () => {
  const [user] = useState(dummyUser);
  return (
    <div>
      <Heading name={user.name} />
      <Sidebar />
      
    </div>
  );
};

export default AdminLayout; 