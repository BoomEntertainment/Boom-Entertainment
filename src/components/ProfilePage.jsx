import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile, clearProfile } from "../store/profileSlice";
import { logout } from "../store/authSlice";
import { FaInstagram, FaSnapchat, FaYoutube } from "react-icons/fa";
import {
  FiMoreHorizontal,
  FiHeart,
  FiVideo,
  FiGrid,
  FiPlusSquare,
  FiUser,
} from "react-icons/fi";
import { CiPlay1 } from "react-icons/ci";
import { FaChevronLeft } from "react-icons/fa6";
import { CiBookmark } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { MdGroups, MdAccountBalanceWallet } from "react-icons/md";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("reels");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { username } = useParams();
  const { currentProfile, loading, error } = useSelector(
    (state) => state.profile
  );
  const { user: me } = useSelector((state) => state.auth);

  useEffect(() => {
    if (username && !loading && !currentProfile) {
      dispatch(fetchProfile(username));
    }
    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, username]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Profile not found</div>
      </div>
    );
  }

  const isOwnProfile = me?.username === currentProfile.data.user.username;

  const images = [
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1519999482648-25049ddd37b1",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1531256379411-3a4dc0b4c7b8",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
    "https://images.unsplash.com/photo-1603415526960-f7e0328d40f9",
    "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
  ];

  return (
    <div className="min-h-screen container bg-[#1a1a1a] text-white font-poppins w-full overflow-hidden">
      <div className=" mx-auto">
        <div className="p-4 lg:py-12 flex flex-col md:flex-row md:gap-8 md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <div className="fixed top-0 left-0 right-0 bg-[#1a1a1a] z-50 flex items-center justify-between w-full md:hidden p-4 border-b border-gray-800">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-800 rounded-full transition-colors"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <h2 className="text-sm font-semibold">
                {currentProfile.data.user.name}
              </h2>
              <div className="flex gap-1.5 relative" ref={moreMenuRef}>
                <FiMoreHorizontal
                  className="text-xl cursor-pointer"
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                />
                {showMoreMenu && (
                  <div className="absolute right-0 top-8 w-48 bg-[#2a2a2a] rounded-lg shadow-lg py-2 z-50">
                    {isOwnProfile && (
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-1 text-left text-sm text-white hover:bg-[#3a3a3a] flex items-center gap-2"
                      >
                        <IoIosLogOut className="text-lg" />
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-16 md:h-0"></div>

            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white overflow-hidden">
              {currentProfile.data.user.profilePhoto ? (
                <img
                  src={currentProfile.data.user.profilePhoto}
                  alt={currentProfile.data.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold">
                  {currentProfile.data.user.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1 md:hidden">
              @{currentProfile.data.user.username}
            </p>

            <div className="md:hidden flex items-center gap-4 mt-2">
              <p className="text-sm font-semibold flex items-center justify-center flex-col">
                3.4M{" "}
                <span className="text-gray-400 font-normal text-xs">
                  Followers
                </span>
              </p>
            </div>

            <div className="lg:flex gap-3 mt-3 md:mt-6 hidden">
              <button className="bg-yellow-400 p-2 rounded">
                <FaSnapchat className="text-black text-lg" />
              </button>
              <button className="bg-yellow-400 p-2 rounded">
                <FaInstagram className="text-black text-lg" />
              </button>
              <button className="bg-yellow-400 p-2 rounded">
                <FaYoutube className="text-black text-lg" />
              </button>
            </div>
          </div>

          <div className="mt-2 mb-2 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left w-full">
            <div className="flex gap-3 mt-3 md:mt-4 items-center md:items-start"></div>
            <div className="flex lg:w-full items-center gap-3 lg:gap-3 px-3">
              <div className="hidden lg:w-full lg:flex justify-between flex-col">
                <h2 className="text-2xl font-semibold text-white">
                  @{currentProfile.data.user.username}
                </h2>
              </div>
              <div className="flex flex-col gap-2 w-full lg:w-auto">
                {isOwnProfile && (
                  <div className="flex gap-2 lg:hidden">
                    <button
                      onClick={() => navigate("/wallet")}
                      className="bg-yellow-400 text-black px-3 py-1 rounded text-sm flex items-center gap-1 flex-1 justify-center"
                    >
                      <MdAccountBalanceWallet className="text-base" />
                      Wallet
                    </button>
                    <button
                      onClick={() => navigate("/community")}
                      className="bg-yellow-400 text-black px-3 py-1 rounded text-sm flex items-center gap-1 flex-1 justify-center"
                    >
                      <MdGroups className="text-base" />
                      Communities
                    </button>
                  </div>
                )}
                <div className="flex gap-2 justify-center">
                  {isOwnProfile ? (
                    <button className="bg-yellow-400 text-black px-3 py-1 rounded text-sm">
                      Edit
                    </button>
                  ) : (
                    <button className="bg-yellow-400 text-black px-3 py-1 rounded text-sm">
                      Follow
                    </button>
                  )}
                  <button className="bg-yellow-400 text-black text-sm px-2 py-1 rounded whitespace-nowrap">
                    Join at ₹99/m
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-3 md:mt-6 lg:hidden">
              <button className="bg-yellow-400 p-2 rounded">
                <FaSnapchat className="text-black text-lg" />
              </button>
              <button className="bg-yellow-400 p-2 rounded">
                <FaInstagram className="text-black text-lg" />
              </button>
              <button className="bg-yellow-400 p-2 rounded">
                <FaYoutube className="text-black text-lg" />
              </button>
            </div>

            <div className="flex gap-2 mt-4 text-xs flex-wrap lg:mx-3">
              <button className="bg-[#1a1a1a] border border-gray-600 px-2 py-2 rounded">
                #Style With Us
              </button>
              <button className="bg-[#1a1a1a] border border-gray-600 px-2 py-2 rounded">
                #Style India
              </button>
              <button className="bg-yellow-400 text-black px-2 py-1 rounded">
                More
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4 mt-4 lg:mx-3">
              <p className="text-sm font-semibold flex items-center justify-center flex-col">
                3.4M{" "}
                <span className="text-gray-400 font-normal text-xs">
                  Followers
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2 lg:mx-3">
              Fashion enthusiast, DM for Collab
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[#1a1a1a]">
          <div className="flex max-w-lg justify-around border-t border-gray-800 md:my-4 py-2 md:justify-around mx-auto md:border-none md:px-4">
            <div
              onClick={() => setActiveTab("reels")}
              className={`cursor-pointer border-b-2 ${
                activeTab === "reels"
                  ? "border-yellow-400"
                  : "border-transparent"
              } pb-1`}
            >
              <CiPlay1 className="text-white text-xl" />
            </div>
            <div
              onClick={() => setActiveTab("videos")}
              className={`cursor-pointer border-b-2 ${
                activeTab === "videos"
                  ? "border-yellow-400"
                  : "border-transparent"
              } pb-1`}
            >
              <FiVideo className="text-white text-xl" />
            </div>
            <div
              onClick={() => setActiveTab("likes")}
              className={`cursor-pointer border-b-2 ${
                activeTab === "likes"
                  ? "border-yellow-400"
                  : "border-transparent"
              } pb-1`}
            >
              <FiHeart className="text-white text-xl" />
            </div>
            <div
              onClick={() => setActiveTab("saved")}
              className={`cursor-pointer border-b-2 ${
                activeTab === "saved"
                  ? "border-yellow-400"
                  : "border-transparent"
              } pb-1`}
            >
              <CiBookmark className="text-white text-xl" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-[1px] bg-black">
            {images.map((url, i) => (
              <img
                key={i}
                src={`${url}`}
                alt={`post-${i}`}
                className="w-full h-[120px] md:h-[200px] object-cover"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
