import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-blue-500">Loading...</p>
    </div>
  );
};

export default Loading;