import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWalletAndHistory,
  setFilters,
  clearFilters,
} from "../store/walletSlice";
import DepositModal from "../components/wallet/DepositModal";
import WithdrawModal from "../components/wallet/WithdrawModal";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaLock } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";

const Wallet = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { balance, history, pagination, loading, error, filters } = useSelector(
    (state) => state.wallet
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  }, [user]);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    dispatch(fetchWalletAndHistory());
  }, [dispatch]);

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchWalletAndHistory({ page: newPage, limit: pagination.limit }));
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "bg-green-900/50 text-green-300 border border-green-700",
      pending: "bg-yellow-900/50 text-yellow-300 border border-yellow-700",
      failed: "bg-red-900/50 text-red-300 border border-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${variants[status]}`}
      >
        {status}
      </span>
    );
  };

  const getTransactionTypeBadge = (type) => {
    const variants = {
      recharge: "bg-blue-900/50 text-blue-300 border border-blue-700",
      reward: "bg-green-900/50 text-green-300 border border-green-700",
      refund: "bg-purple-900/50 text-purple-300 border border-purple-700",
      withdrawal: "bg-yellow-900/50 text-yellow-300 border border-yellow-700",
      other: "bg-gray-900/50 text-gray-300 border border-gray-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          variants[type] || variants.other
        }`}
      >
        {type}
      </span>
    );
  };

  const filteredHistory = history.filter((transaction) => {
    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    if (filters.transactionType !== "all") {
      if (transaction.transactionType !== filters.transactionType) {
        if (
          filters.transactionType === "withdrawal" &&
          transaction.type === "payout"
        ) {
          return true;
        }
        return false;
      }
    }

    if (filters.status !== "all" && transaction.status !== filters.status) {
      return false;
    }

    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1c1c1c] rounded-2xl shadow-xl p-8 text-center border border-gray-800">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
              <FaLock className="text-4xl text-yellow-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Access Your Wallet
          </h2>
          <p className="text-gray-400 mb-8">
            Login or create an account to manage your wallet, add money, and
            withdraw your earnings.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/auth")}
              className="w-full bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
            >
              <FaWallet className="text-lg" />
              Login to Access Wallet
            </button>

            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/auth?tab=register")}
                className="text-yellow-400 hover:text-yellow-300 font-medium"
              >
                Register Now
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
<div className="mobileheader flex items-center justify-between mb-5 lg:hidden">
    <h3><FaChevronLeft /></h3>
    <h3 className="text-lg font-poppins">My Wallet</h3>
     
    <IoIosMore className="text-xl font-bold"/>

   </div>
     {/* {error && (
        <div className="mb-4 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
          {error}
        </div>
      )}
    */}
      <div className="mb-8 md:mb-8">
        <div className=" rounded-2xl shadow-xl md:p-8 text-center border border-[#252525]">
        <h3 className="text-white text-2xl font-semibold mb-2 hidden lg:block">MY WALLET</h3>
         <div className="bg-[#1c1c1c] rounded-lg px-4  py-3 md:py-6 md:mb-6 flex items-start justify-between">
          <div className="flex flex-col mb-2">
            <p className="text-sm text-gray-400">Total balance</p>
                      <p className="text-2xl font-semibold text-left">₹ {balance}</p>
          </div>
        </div>
           <div className="flex flex-col lg:flex-row  justify-start gap-2 md:gap-4 mb-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="py-1 mx-3 md:mx-0 md:px-6 md:py-3 bg-[#f1c40f] text-black rounded-lg hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Add Credit
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={balance <= 0}
              className={`py-1  mx-3 md:mx-0 md:px-6 md:py-3 border bg-[#f1c40f] border-gray-600 text-black rounded-lg hover:bg-[white] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                balance <= 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Withdraw Now
            </button>
          </div>
        
        </div>
      
      </div>
      

      <div className=" rounded-2xl shadow-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Transaction History
          </h2>
          <button
            onClick={() => dispatch(clearFilters())}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Transaction Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1c1c1c] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="payin">Pay In</option>
              <option value="payout">Pay Out</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-6">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              value={filters.transactionType}
              onChange={(e) =>
                handleFilterChange("transactionType", e.target.value)
              }
              className="w-full px-4 py-2.5 bg-[#1c1c1c] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="recharge">Recharge</option>
              <option value="reward">Reward</option>
              <option value="refund">Refund</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-6">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-4 py-2.5 bg-[#1c1c1c] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-6">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#1c1c1c]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {filteredHistory.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "payin"
                              ? "bg-green-900/50 text-green-300 border border-green-700"
                              : "bg-red-900/50 text-red-300 border border-red-700"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                        ₹{transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTransactionTypeBadge(transaction.transactionType)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    pagination.page === pagination.pages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div> 

      <DepositModal
        show={showDepositModal}
        onHide={() => setShowDepositModal(false)}
      />
      <WithdrawModal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
      />
    </div>
  );
};

export default Wallet;
