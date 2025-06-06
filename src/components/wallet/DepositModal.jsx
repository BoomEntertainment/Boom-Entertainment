import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addMoney } from "../../store/walletSlice";
import { toast } from "react-toastify";

const DepositModal = ({ show, onHide }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onHide();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onHide]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        addMoney({ amount: parseFloat(amount), transactionType: "recharge" })
      ).unwrap();
      toast.success("Amount deposited successfully");
      onHide();
      setAmount("");
    } catch (error) {
      toast.error(error.message || "Failed to deposit amount");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onHide();
      }}
    >
      <div
        ref={modalRef}
        className="bg-[#1a1a1a] rounded-lg w-full max-w-md border border-[#252525]"
      >
        <div className="p-6">
          <h2 className="text-base font-bold text-white mb-4">Add Credit</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-xs font-medium text-gray-400 mb-2"
              >
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onHide}
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
                {loading ? "Processing..." : "Add Credit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
