const FullPageWrapper = ({ children, full = false }) => {
  return (
    <div className={`flex-1 w-full ${!full ? 'p-4 max-w-6xl mx-auto' : ''}`}>
      {children}
    </div>
  );
};

export default FullPageWrapper;