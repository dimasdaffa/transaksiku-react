import React, { useState, useEffect } from 'react';
import Card from '../../../../Components/Card';
import Swal from 'sweetalert2';

const ProfileSettings = () => {
  const getUserData = () => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return {
      name: 'Andi Saputra',
      email: 'user@transaksiku.com',
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
    };
  };

  const [profileData, setProfileData] = useState(getUserData);
  const [formData, setFormData] = useState({ ...profileData });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({ ...profileData });
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setProfileData(formData);
      
      const { password, ...safeData } = formData;
      localStorage.setItem('userData', JSON.stringify(safeData));
      
      setIsEditing(false);
      setIsLoading(false);
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Profil Management</h2>

        <div className="flex flex-col md:flex-row items-center md:space-x-6 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 mb-4 md:mb-0">
            <img 
              src={profileData.profileImage || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-medium">{profileData.name}</h3>
            <p className="text-gray-500">{profileData.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => setIsEditing(true)}
          >
            Edit Profil
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">URL Foto Profil</label>
              <input
                type="text"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan URL untuk foto profil Anda
              </p>
            </div>

            <div className="flex space-x-3">
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
                  'Simpan Perubahan'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                disabled={isLoading}
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
};

export default ProfileSettings;