import { useEffect, useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { FiVideo } from "react-icons/fi";
import { CgAddR } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { IoIosLogIn } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigation = (id) => {
    setActiveTab(id);
    switch (id) {
      case "profile":
        navigate(`/profile/${user?.username}`);
        break;
      case "Long Video":
        navigate("/");
        break;
      case "Short Video":
        navigate("/");
        break;
      case "Login":
        navigate("/auth");
        break;
      case "Logout":
        dispatch(logout());
        navigate("/auth");
        break;
      default:
        break;
    }
  };

  const navigationItems = [
    {
      id: "Short Video",
      icon: <CiPlay1 className="text-[26px] md:text-[24px] font-semibold" />,
      label: "Short Video",
    },
    {
      id: "Long Video",
      icon: <FiVideo className="text-[26px] md:text-[24px] font-semibold" />,
      label: "Long Video",
    },
    {
      id: "add",
      icon: <CgAddR className="text-[26px] md:text-[24px] font-semibold" />,
      label: "Add",
    },
    {
      id: "Search",
      icon: <FiSearch className="text-[26px] md:text-[24px] font-semibold" />,
      label: "Search",
    },
    {
      id: "profile",
      icon: (
        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border-2 border-gray-400 overflow-hidden">
          <img
            src={user?.profilePicture || "profile.jpg"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      ),
      label: "Profile",
    },
    !user
      ? {
          id: "Login",
          icon: (
            <IoIosLogIn className="text-[26px] md:text-[24px] font-semibold" />
          ),
          label: "Login",
        }
      : {
          id: "Logout",
          icon: (
            <IoIosLogOut className="text-[26px] md:text-[24px] font-semibold" />
          ),
          label: "Logout",
        },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-white z-50 pb-4">
        <div className="flex justify-around items-center h-12">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col font-semibold items-center justify-center w-full h-full transition-colors ${
                activeTab === item.id ? "text-[#f1c40f]" : "text-white"
              }`}
            >
              {item.icon}
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-[#1a1a1a] text-white border-r border-gray-800 z-40">
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold">BOOM ENTERTAINMENTS</h1>
          </div>
          {/* Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors hover:bg-gray-800 ${
                      activeTab === item.id
                        ? "bg-gray-800 text-[#f2c50f]"
                        : "text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="text-lg">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
