import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 p-4 text-center">
      <p className="text-sm">
        Designed by:
        <a href="https://github.com/Altterisk" className="text-orange-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">Thanh Tu Le</a>,
        <a href="https://github.com/SoneVijay" className="text-orange-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">Vijay Tangub</a>, 
        <a href="https://github.com/me-li-za" className="text-orange-500 hover:underline ml-1" target="_blank" rel="noopener noreferrer">Meliza Labastida</a>
      </p>
      <p className="text-xs mt-2">&copy; 2025 Learning Management System</p>
    </footer>
  );
};

export default Footer;
