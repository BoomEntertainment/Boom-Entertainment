import React from 'react';
import { FaInstagram, FaYoutube } from 'react-icons/fa';
import { FiMoreHorizontal, FiHeart, FiVideo, FiGrid, FiPlusSquare, FiUser } from 'react-icons/fi';
import { CiPlay1 } from 'react-icons/ci';
import { FaChevronLeft } from "react-icons/fa6";
import { CiBookmark } from "react-icons/ci";

const ProfilePage = () => {
    const images = [
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1519999482648-25049ddd37b1',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  'https://images.unsplash.com/photo-1531256379411-3a4dc0b4c7b8',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
  'https://images.unsplash.com/photo-1603415526960-f7e0328d40f9',
  'https://images.unsplash.com/photo-1593642532973-d31b6557fa68',
  'https://images.unsplash.com/photo-1518770660439-4636190af475',
];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-poppins w-full max-w-sm mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <FaChevronLeft className='text-white'/>

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


        {/* Action Buttons */}
        <div className="flex gap-3 mt-3 items-center">
            
    <p className="text-sm  mb-1 font-semibold flex flex-col h-[30px]">3.4M <span className="text-gray-400 font-normal text-xs">Followers</span></p>

          <button className="bg-yellow-400 text-black px-2 py-1 rounded text-xs h-[30px]">Follow</button>
          <button className="bg-yellow-400 text-black text-xs font-semibold px-4 py-1 rounded h-[30px]">Access at ₹99/m</button>
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
          <button className="bg-[#1a1a1a] border border-gray-600 px-2 py-2 rounded">#Style With Us</button>
          <button className="bg-[#1a1a1a] border border-gray-600 px-2 py-2 rounded">#Style India</button>
          <button className="bg-yellow-400 text-black px-2 py-1 rounded">More</button>
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center px-4">Fashion enthusiast, DM for Collab</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-t border-gray-800 mt-4 py-2">
        <CiPlay1 className="text-white text-xl" />
        <FiVideo className="text-white text-xl" />
        <FiHeart className="text-white text-xl" />
        <CiBookmark  className="text-white text-xl" />
      </div>

      {/* Gallery Grid */}
    <div className="grid grid-cols-3 gap-[1px] bg-black">
  {images.map((url, i) => (
    <img
      key={i}
        src={`${url}`}
      alt={`post-${i}`}
      className="w-full h-[120px] object-cover"
    />
  ))}
</div>


     
    </div>
  );
};

export default ProfilePage;