import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCommunities } from "../../store/communitySlice";
import { Link, useNavigate } from "react-router-dom";
import { api, endpoints } from "../../api/config";
import { toast } from "react-toastify";
import { FaChevronLeft } from "react-icons/fa";
import { IoIosAdd, IoIosMore } from "react-icons/io";
import { FaUsers } from "react-icons/fa";

const CreateCommunityModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    cost: "",
    profile_photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Cleanup preview URL when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPreviewUrl(null);
      setFormData({ name: "", bio: "", cost: "", profile_photo: null });
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Sanitize filename and create a new File object
    const sanitizedFile = new File(
      [file],
      file.name.replace(/[^a-zA-Z0-9.-]/g, "_"),
      { type: file.type }
    );

    setFormData({ ...formData, profile_photo: sanitizedFile });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("cost", formData.cost);
      if (formData.profile_photo) {
        formDataToSend.append("profile_photo", formData.profile_photo);
      }

      const response = await api.post(
        endpoints.community.create,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Community created successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create community"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-[#1a1a1a] rounded-lg w-full max-w-md border border-[#252525]"
      >
        <div className="p-6">
          <h2 className="text-base font-bold text-white mb-4">
            Create New Community
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#252525] flex items-center justify-center">
                      <span className="text-xs text-gray-400">No image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">
                    Upload a profile photo (JPEG, PNG, or GIF)
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter community name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                rows="3"
                placeholder="Enter community description"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Creator Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter creator cost"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm bg-[#f1c40f] text-black font-semibold rounded-lg hover:bg-[#f2c50f] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating..." : "Create Community"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CommunityCard = ({ community, type }) => {
  return (
    <Link
      to={`/community/${community._id}`}
      className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] transition-all"
    >
      <div className="flex items-center gap-4">
        {community.profile_photo ? (
          <img
            src={community.profile_photo}
            alt={community.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl font-bold">
            {community.name[0]}
          </div>
        )}
        <div>
          <h3 className="text-base">{community.name}</h3>
          <p className="text-xs text-gray-400">{community.bio}</p>
          {type !== "founded" && community.founder && (
            <p className="text-xs text-gray-500 mt-1">
              by {community.founder.username}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {type === "founded" ? "Created" : "Joined"}{" "}
            {new Date(
              type === "founded" ? community.createdAt : community.joinedAt
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

const CommunitySection = ({ title, communities, type }) => {
  if (!communities?.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg mb-4">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {communities.map((community) => (
          <CommunityCard
            key={community._id}
            community={community}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, count }) => (
  <div className="flex flex-col items-center">
    <h3 className="text-base md:text-xl text-yellow-500">{count}</h3>
    <p className="text-xs text-gray-400 mt-1 text-center">{title}</p>
  </div>
);

export default function UserCommunities() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector(
    (state) => state.community.userCommunities
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserCommunities());
  }, [dispatch]);

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

  const handleCreateSuccess = () => {
    dispatch(fetchUserCommunities());
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-300"></div>
      </div>
    );
  if (error) return <div className="text-red-500">{error.message}</div>;
  if (!data) return null;

  const { statistics, founded, creator, following } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 right-0 bg-[#1a1a1a] z-50 flex items-center justify-between w-full md:hidden p-4 border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-800 rounded-full transition-colors"
        >
          <FaChevronLeft className="text-sm" />
        </button>
        <h2 className="text-sm font-semibold">My Communities</h2>
        <div className="flex gap-1.5 relative" ref={moreMenuRef}>
          <IoIosMore
            className="text-xl cursor-pointer"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
          />
          {showMoreMenu && (
            <div className="absolute right-0 top-8 w-48 bg-[#2a2a2a] rounded-lg shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  setIsCreateModalOpen(true);
                  setShowMoreMenu(false);
                }}
                className="w-full px-4 py-1 text-left text-sm text-white hover:bg-[#3a3a3a] flex items-center gap-2"
              >
                <IoIosAdd className="text-lg" />
                Create Community
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-16 md:h-0"></div>

      <div className="flex justify-between items-center lg:mb-6">
        <h1 className="text-lg font-semibold text-white hidden lg:block">
          My Communities
        </h1>
      </div>

      <div className="flex justify-between items-center px-4 py-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
        <StatCard title="Founded" count={statistics.foundedCount} />
        <div className="w-px h-8 bg-gray-800"></div>
        <StatCard title="Creator" count={statistics.creatorCount} />
        <div className="w-px h-8 bg-gray-800"></div>
        <StatCard title="Following" count={statistics.followingCount} />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-1.5 bg-yellow-500 text-sm text-black rounded-lg font-semibold hover:bg-yellow-600 flex items-center gap-2"
        >
          <IoIosAdd /> New Community
        </button>
      </div>

      <CommunitySection
        title="Communities You Founded"
        communities={founded}
        type="founded"
      />
      <CommunitySection
        title="Communities You're a Creator In"
        communities={creator}
        type="creator"
      />
      <CommunitySection
        title="Communities You Follow"
        communities={following}
        type="following"
      />

      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
