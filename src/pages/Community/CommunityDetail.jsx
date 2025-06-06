import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunityById,
  toggleFollowCommunity,
  becomeCreator,
  clearActionStatus,
} from "../../store/communitySlice";
import { toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa6";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { CiBookmark } from "react-icons/ci";

import { CiPlay1 } from "react-icons/ci";
import {
  FiMoreHorizontal,
  FiHeart,
  FiVideo,

} from "react-icons/fi";
export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [activeTab, setActiveTab] = useState("reels");
  
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
  const {
    data: community,
    loading,
    error,
  } = useSelector((state) => state.community.currentCommunity);
  const actionStatus = useSelector((state) => state.community.actionStatus);
  useEffect(() => {
    if (community) {
      console.log("Fetched Community Data:", community);
    }
  }, [community]);

  useEffect(() => {
    dispatch(fetchCommunityById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (actionStatus.success) {
      toast.success(actionStatus.message);
      dispatch(clearActionStatus());
    }
    if (actionStatus.error) {
      toast.error(actionStatus.error.message);
      dispatch(clearActionStatus());
    }
  }, [actionStatus, dispatch]);

  const handleFollow = () => {
    dispatch(toggleFollowCommunity(id));
  };

  const handleBecomeCreator = () => {
    dispatch(becomeCreator(id));
  };

  const handleFounderClick = (e) => {
    e.preventDefault();
    if (community?.founder?.username) {
      navigate(`/profile/${community.founder.username}`);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
      </div>
    );
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!community) return null;

  return (
    <div className="min-h-screen bg-[#1a1a1a] w-full">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 left-0 right-0 bg-[#1a1a1a] border-b border-[#252525] z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#252525] rounded-full transition-colors"
          >
            <FaChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-semibold text-white truncate max-w-[200px] ">
            {community.name}
          </h1>
          <div className="flex items-center gap-2">
            <h2 className="text-xl">
              <CiBookmark />
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-[#252525] rounded-full transition-colors"
              >
                <IoEllipsisHorizontal className="w-5 h-5 text-white" />
              </button>
              {showMoreMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-[#252525] rounded-lg shadow-lg py-1 z-20">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      // Add share functionality here
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#252525] transition-colors"
                  >
                    Share Community
                  </button>
                  {community.isCreator && (
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        // Add edit community functionality here
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#252525] transition-colors"
                    >
                      Edit Community
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#1a1a1a] rounded-lg lg:p-6">
          {/* Hide community name on mobile since it's in the header */}
          <div className="flex flex-col lg:flex-row items-center  gap-2">
            {community.profile_photo ? (
              <img
                src={community.profile_photo}
                alt={community.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center text-3xl font-bold">
                {community.name[0]}
              </div>
            )}
            <div className="flex items-center gap-2 lg:mx-10 lg:gap-10 flex-col lg:flex-row">
              {/* <h1 className="text-xl font-bold hidden lg:block">
                {community.name}
              </h1> */}
              <p className="text-white text-xl text-center mt-2">
                @{community.name}
              </p>
              <div className="flex items-center gap-4 mt-4 ">
                <div className="text-sm flex flex-col items-center">
                  <span className="font-semibold">
                    {community.followersCount}
                  </span>{" "}
                  <span className="text-gray-400">followers</span>
                </div>
                <div className="text-sm flex flex-col items-center">
                  <span className="font-semibold">
                    {community.creatorsCount}
                  </span>{" "}
                  <span className="text-gray-400 items-center">creators</span>
                </div>
                <div className="text-sm flex flex-col">
                  <span className="font-semibold">
                    {/* {community.following} */}0
                  </span>{" "}
                  <span className="text-gray-400">Following</span>
                </div>
              </div>
            </div>
          </div>
<div className="flex flex-col lg:flex-row my-3 justify-around  lg:mx-16 ">
          <div className="flex gap-1 mt-6">
            {!community.isCreator && (
              <button
                onClick={handleBecomeCreator}
                disabled={actionStatus.loading}
                className="px-6 py-2 bg-yellow-500  text-black rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-50"
              >
                {actionStatus.loading ? "Processing..." : "Become a Creator"}
                {community.cost > 0 && ` (₹${community.cost})`}
              </button>
            )}

            <button
              onClick={handleFollow}
              disabled={actionStatus.loading}
              className={`px-6 py-2 h-[40px] flex items-center justify-center rounded-lg text-sm bg-[#f1c40f] text-black  ${
                community.isFollowing
                  ? "bg-gray-700 hover:bg-white"
                  : "bg-[#252525] hover:bg-white"
              }`}
            >
              {actionStatus.loading
                ? "Processing..."
                : community.isFollowing
                ? "Unfollow"
                : "Follow"}
            </button>
            <button className="text-sm h-[40px] flex items-center justify-center bg-[#f1c40f] rounded-md  text-black px-2 ">
              My Community
            </button>
            <button className="text-sm h-[40px] flex items-center justify-center bg-[#f1c40f] rounded-md  text-black px-2">
              Dashboard
            </button>
          </div>
<div className="flex lg:gap-3 lg:flex-row justify-around my-6">
   <button className="text-sm  rounded-sm  border-[1px] border-gray-700 py-1 px-2 ">
             Edit Profile
            </button>
            <button className="text-sm  rounded-sm  border-[1px] border-gray-700 py-1 px-2">
            Playlist
            </button>
             <button className="text-sm  rounded-sm  border-[1px] border-gray-700 py-1 px-2">
            History
            </button>
</div>
</div>
<p className="text-[#8c8c8c] text-sm text-center  ">{community.bio}</p>
          <div className="mt-8">
            <h2 className="text-base font-semibold mb-4">
              About this Community
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div
                className="bg-[#252525] p-4 rounded-lg cursor-pointer hover:bg-[#303030] transition-colors"
                onClick={handleFounderClick}
              >
                <p className="text-xs pb-1 text-gray-400">Founded by</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{community.founder.username}</p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </div>
              <div className="bg-[#252525] p-4 rounded-lg">
                <p className="text-xs pb-1 text-gray-400">Created on</p>
                <p className="font-semibold">
                  {new Date(community.createdAt).toLocaleDateString()}
                </p>
              </div>
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
    </div>
  );
}
