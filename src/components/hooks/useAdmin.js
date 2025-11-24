import { useState, useEffect } from 'react';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const saved = localStorage.getItem('is_admin');
      setIsAdmin(saved === 'true');
    };

    checkAdminStatus();

    const handleAdminChange = () => {
      checkAdminStatus();
    };

    window.addEventListener('adminStatusChanged', handleAdminChange);
    return () => window.removeEventListener('adminStatusChanged', handleAdminChange);
  }, []);

  const login = () => {
    setIsAdmin(true);
    localStorage.setItem('is_admin', 'true');
    window.dispatchEvent(new Event('adminStatusChanged'));
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('is_admin');
    window.dispatchEvent(new Event('adminStatusChanged'));
  };

  return {
    isAdmin,
    login,
    logout
  };
};