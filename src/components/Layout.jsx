import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="md:ml-64 pb-16 md:pb-0 min-h-screen">
        <div className="w-full h-full ">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;