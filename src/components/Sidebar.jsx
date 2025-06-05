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

  const mainNavigationItems = [
    {
      id: "Short Video",
      icon: <CiPlay1 className="text-[1.25rem] lg:text-md font-semibold" />,
      label: "Short Video",
    },
    {
      id: "Long Video",
      icon: <FiVideo className="text-[1.25rem] lg:text-md font-semibold" />,
      label: "Long Video",
    },
    {
      id: "add",
      icon: <CgAddR className="text-[1.25rem] lg:text-md font-semibold" />,
      label: "Add",
    },
    {
      id: "Search",
      icon: <FiSearch className="text-[1.25rem] lg:text-md font-semibold" />,
      label: "Search",
    },
    {
      id: "profile",
      icon: (
        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border-2 border-gray-400 overflow-hidden flex items-center justify-center">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      ),
      label: "Profile",
    },
  ];

  const authNavigationItem = !user
    ? {
        id: "Login",
        icon: (
          <IoIosLogIn className="text-[1.25rem] lg:text-md font-semibold" />
        ),
        label: "Login",
      }
    : {
        id: "Logout",
        icon: (
          <IoIosLogOut className="text-[1.25rem] lg:text-md font-semibold" />
        ),
        label: "Logout",
      };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-white z-50">
        <div className="flex justify-around items-center h-12">
          {mainNavigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col font-semibold items-center justify-center cursor-pointer w-full h-full transition-colors ${
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
        <div className="flex flex-col w-full h-full">
          {/* Logo */}
          <div className="p-6">
            <h1 className="text-lg font-bold">BOOM MVP</h1>
          </div>

          {/* Main Navigation Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {mainNavigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`flex items-center space-x-3 w-full p-3 cursor-pointer rounded-lg transition-colors hover:bg-gray-800 ${
                      activeTab === item.id
                        ? "bg-gray-800 text-[#f2c50f]"
                        : "text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm mt-[0.5px]">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Navigation Item at bottom */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => handleNavigation(authNavigationItem.id)}
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors hover:bg-gray-800 ${
                activeTab === authNavigationItem.id
                  ? "bg-gray-800 text-[#f2c50f]"
                  : "text-white"
              }`}
            >
              {authNavigationItem.icon}
              <span className="text-sm mt-[0.5px]">
                {authNavigationItem.label}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
