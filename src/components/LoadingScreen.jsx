const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-[#1a1a1a] rounded-full"></div>
          </div>
        </div>
        <p className="text-gray-200 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
