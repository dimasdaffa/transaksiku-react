import React, { useState, useEffect } from 'react';
import ProfileSettings from './Components/ProfileSettings';
import AppSettings from './Components/AppSettings';
import SecuritySettings from './Components/SecuritySettings';
import { useNavigate, useLocation } from 'react-router-dom';

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get active tab from URL hash or default to 'profile'
  const [activeTab, setActiveTab] = useState('profile');

  // Update active tab when URL hash changes
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['profile', 'app', 'security'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/settings#${tab}`, { replace: true });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings & Profile</h1>
      
      <div className="mb-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('profile')}
          >
            Profil
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'app' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('app')}
          >
            Aplikasi
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'security' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange('security')}
          >
            Keamanan
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'app' && <AppSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;