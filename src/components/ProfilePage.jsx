import React, { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProfile, clearProfile } from "../store/profileSlice";
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

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("reels"); // default tab

  const dispatch = useDispatch();


  // const { username } = useParams();
  // const { currentProfile, loading, error } = useSelector(
  //   (state) => state.profile
  // );
  // const { me } = useSelector((state) => state.profile);

  // useEffect(() => {
  //   if (username) {
  //     dispatch(fetchProfile(username));
  //   }
  //   return () => {
  //     dispatch(clearProfile());
  //   };
  // }, [dispatch, username]);
   const { username } = useParams();
  const { currentProfile, loading, error } = useSelector(
    (state) => state.profile
  );
  const { user: me } = useSelector((state) => state.auth); // Access user from authSlice

  useEffect(() => {
    console.log("Username from URL:", username); // Log the username from useParams
    if (username) {
      console.log("Dispatching fetchProfile for username:", username);
      dispatch(fetchProfile(username));
    }
    return () => {
      console.log("Clearing profile on unmount");
      dispatch(clearProfile());
    };
  }, [dispatch, username]);

  // Log the entire Redux state for debugging
  const entireState = useSelector((state) => state);
  console.log("Entire Redux State:", entireState);
  console.log("Current Profile:", currentProfile);
  console.log("Me (Authenticated User):", me);
  console.log("Loading:", loading);
  console.log("Error:", error);

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
    <div className="min-h-screen container bg-[#1a1a1a] text-white font-poppins w-full overflow-hidden">
      {/* Wrapper for responsive layout */}
      <div className="max-w-4xl mx-auto">
        {/* Sidebar Profile Section (left side on large screens) */}
       <div className=" p-4 lg:py-12 flex flex-col md:flex-row md:gap-8 md:items-start">
  {/* Left Section - Profile Picture and Social */}
  <div className="flex flex-col items-center md:items-start ">
    {/* Mobile Only Top Header */}
    <div className="flex items-center justify-between w-full md:hidden mb-3">
      <FaChevronLeft className="text-white" />
      <h2 className="text-sm font-semibold">{currentProfile.data.user.name}</h2>
      <div className="flex"><CiBookmark className="text-xl"/> <FiMoreHorizontal className="text-xl" />
</div>
     
    </div>

    {/* Avatar */}
    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white">
      {<img src={currentProfile.data.user.profilePhoto}/>||currentProfile.data.user.username?.[0]?.toUpperCase()  } 
    </div>
    
    {/* Username for mobile */}
    <p className="text-sm text-gray-400 mt-1 md:hidden">@{currentProfile.data.user.username}</p>

<<<<<<< HEAD
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
          </div>
=======
    {/* Social Media Buttons */}
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
>>>>>>> 57001f02ef6eac8188fe041953cf317c8d0175d6

  {/* Right Section - Info & Actions */}
  <div className="mt-4 md:mt-0 flex flex-col items-center md:items-start text-center md:text-left w-full">
      <div className="flex gap-3 mt-3 md:mt-4 items-center md:items-start">
      
    </div>
    {/* Username and Actions (desktop) */}
    <div className="flex items-center gap-3 lg:gap-3 px-3">
      <h2 className="text-2xl hidden lg:block font-semibold text-white mr-10">@{currentProfile.data.user.username}</h2>
       <p className="text-sm font-semibold flex flex-col lg:mx-3">
        3.4M{" "}
        <span className="text-gray-400 font-normal text-xs">Followers</span>
      </p>
      <button className="bg-yellow-400 text-black px-3 py-1 rounded text-sm">
        Follow
      </button>
     <button className="bg-yellow-400 text-black text-sm  px-2 py-1 rounded whitespace-nowrap">
  Access at ₹99/m
</button>

     
    </div>

   
 
 {isOwnProfile && (
        <button className="bg-yellow-400 my-4 md:mx-3 text-black text-sm  px-4 py-1 rounded whitespace-nowrap">
          Edit Profile
        </button>
      )}
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
    {/* Hashtags */}
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

    {/* Bio */}
    <p className="text-xs text-gray-400 mt-2 lg:mx-3">
      Fashion enthusiast, DM for Collab
    </p>
  </div>
</div>


        {/* Right Section */}
        <div className="flex-1 bg-[#1a1a1a]">
          {/* Tabs */}
          {/* <div className="flex w-full justify-around border-t border-gray-800 md:my-4 py-2 md:gap-40 md:justify-center md:border-none md:px-4">
            <CiPlay1 className="text-white text-xl cursor-pointer" />
            <FiVideo className="text-white text-xl cursor-pointer" />
            <FiHeart className="text-white text-xl cursor-pointer" />
            <CiBookmark className="text-white text-xl cursor-pointer" />
          </div> */}
<div className="flex max-w-lg justify-around border-t border-gray-800 md:my-4 py-2  md:justify-around  mx-auto md:border-none md:px-4">
  <div
    onClick={() => setActiveTab("reels")}
    className={`cursor-pointer border-b-2 ${
      activeTab === "reels" ? "border-yellow-400" : "border-transparent"
    } pb-1`}
  >
    <CiPlay1 className="text-white text-xl" />
  </div>
  <div
    onClick={() => setActiveTab("videos")}
    className={`cursor-pointer border-b-2 ${
      activeTab === "videos" ? "border-yellow-400" : "border-transparent"
    } pb-1`}
  >
    <FiVideo className="text-white text-xl" />
  </div>
  <div
    onClick={() => setActiveTab("likes")}
    className={`cursor-pointer border-b-2 ${
      activeTab === "likes" ? "border-yellow-400" : "border-transparent"
    } pb-1`}
  >
    <FiHeart className="text-white text-xl" />
  </div>
  <div
    onClick={() => setActiveTab("saved")}
    className={`cursor-pointer border-b-2 ${
      activeTab === "saved" ? "border-yellow-400" : "border-transparent"
    } pb-1`}
  >
    <CiBookmark className="text-white text-xl" />
  </div>
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

      {isOwnProfile && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">
              Account Settings
            </h2>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;