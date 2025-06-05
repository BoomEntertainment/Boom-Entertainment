import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProfile, clearProfile } from "../store/profileSlice";
import { FaInstagram, FaYoutube } from "react-icons/fa";
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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const { currentProfile, loading, error } = useSelector(
    (state) => state.profile
  );
  const { me } = useSelector((state) => state.profile);

  useEffect(() => {
    if (username) {
      dispatch(fetchProfile(username));
    }
    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  const isOwnProfile = me?.username === currentProfile.username;

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
    <div className="min-h-screen bg-[#1a1a1a] text-white font-poppins w-full overflow-hidden">
      {/* Wrapper for responsive layout */}
      <div className="max-w-sm md:max-w-5xl mx-auto grid md:grid-cols-[250px_1fr]">
        {/* Sidebar Profile Section (left side on large screens) */}
        <div className="md:border-r md:border-gray-800 p-4 flex flex-col items-center md:items-start">
          <div className="flex items-center justify-between w-full md:hidden">
            <FaChevronLeft className="text-white" />
            <h2 className="text-sm font-semibold">{currentProfile.username}</h2>
            <FiMoreHorizontal className="text-xl" />
          </div>

          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white">
            {currentProfile.username?.[0]?.toUpperCase() || "?"}
          </div>
          <p className="text-sm text-gray-400 mt-1">@Gabar_32</p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-3 items-center md:flex-col md:items-start md:gap-2">
            <p className="text-sm font-semibold flex flex-col h-[30px]">
              3.4M{" "}
              <span className="text-gray-400 font-normal text-xs">
                Followers
              </span>
            </p>
            <button className="bg-yellow-400 text-black px-2 py-1 rounded text-xs h-[30px]">
              Follow
            </button>
            <button className="bg-yellow-400 text-black text-xs font-semibold px-4 py-1 rounded h-[30px]">
              Access at ₹99/m
            </button>
            {isOwnProfile && (
              <button className="bg-yellow-400 text-black text-xs font-semibold px-4 py-1 rounded h-[30px]">
                Edit Profile
              </button>
            )}
          </div>

          {/* Social Media Buttons */}
          <div className="flex gap-3 mt-3">
            <button className="bg-yellow-400 p-2 rounded">
              <FaInstagram className="text-black text-lg" />
            </button>
            <button className="bg-yellow-400 p-2 rounded">
              <FaYoutube className="text-black text-lg" />
            </button>
          </div>

          {/* Hashtags */}
          <div className="flex gap-2 mt-4 text-xs flex-wrap">
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

          <p className="text-xs text-gray-400 mt-2 text-center md:text-left">
            Fashion enthusiast, DM for Collab
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex justify-around border-t border-gray-800 mt-4 py-2 md:justify-start md:gap-8 md:border-none md:px-4">
            <CiPlay1 className="text-white text-xl cursor-pointer" />
            <FiVideo className="text-white text-xl cursor-pointer" />
            <FiHeart className="text-white text-xl cursor-pointer" />
            <CiBookmark className="text-white text-xl cursor-pointer" />
          </div>

          {/* Gallery Grid */}
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
