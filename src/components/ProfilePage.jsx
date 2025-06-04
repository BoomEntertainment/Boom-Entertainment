import React from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMoreHorizontal, FiHeart, FiVideo, FiGrid, FiPlusSquare, FiUser } from 'react-icons/fi';
import { CiPlay1 } from 'react-icons/ci';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-black text-white font-poppins w-full max-w-sm mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 className="text-sm font-semibold">Rahul Gupta</h2>
        <div className="flex items-center gap-2">
          <FiMoreHorizontal className="text-xl" />
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-4">
        <img
          src="https://randomuser.me/api/portraits/men/75.jpg"
          alt="Profile"
          className="w-16 h-16 rounded-full border border-gray-700"
        />
        <p className="text-sm text-gray-400 mt-1">@Gabar_32</p>

        <p className="text-sm mt-2 font-semibold">3.4M <span className="text-gray-400 font-normal">Followers</span></p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <button className="bg-yellow-400 text-black text-xs font-semibold px-4 py-1 rounded">Follow</button>
          <button className="bg-yellow-400 text-black text-xs font-semibold px-4 py-1 rounded">Access at ₹99/m</button>
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
        <div className="flex gap-2 mt-4 text-xs">
          <button className="bg-[#1a1a1a] border border-gray-600 px-2 py-1 rounded">#Style With Us</button>
          <button className="bg-[#1a1a1a] border border-gray-600 px-2 py-1 rounded">#Style India</button>
          <button className="bg-yellow-400 text-black px-2 py-1 rounded">More</button>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center px-4">Fashion enthusiast, DM for Collab</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-t border-gray-800 mt-4 py-2">
        <CiPlay1 className="text-white text-xl" />
        <FiVideo className="text-white text-xl" />
        <FiHeart className="text-white text-xl" />
        <FiGrid className="text-white text-xl" />
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-[1px] bg-black">
        {[...Array(9)].map((_, i) => (
          <img
            key={i}
            src={`https://source.unsplash.com/random/300x300?sig=${i}`}
            alt="post"
            className="w-full h-[120px] object-cover"
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-14">
        <FiVideo className="text-white text-xl" />
        <FiGrid className="text-white text-xl" />
        <FiPlusSquare className="text-white text-xl" />
        <FiHeart className="text-white text-xl" />
        <FiUser className="text-white text-xl" />
      </div>
    </div>
  );
};

export default ProfilePage;