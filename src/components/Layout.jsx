import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Sidebar />

      <main className="md:ml-64 md:pb-0 min-h-screen">
        <div className="w-full h-full flex items-center justify-center max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
