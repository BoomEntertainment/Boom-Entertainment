import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withdrawMoney } from "../../store/walletSlice";
import { toast } from "react-toastify";

const WithdrawModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    amount: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.wallet);

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

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      setFormData({
        amount: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, accountNumber, ifscCode, accountHolderName } = formData;

    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!accountNumber || !ifscCode || !accountHolderName) {
      toast.error("Please fill in all bank details");
      return;
    }

    // Validate IFSC code format (11 characters, alphanumeric)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      toast.error("Please enter a valid IFSC code");
      return;
    }

    // Validate account number (numeric, 9-18 digits)
    if (!/^\d{9,18}$/.test(accountNumber)) {
      toast.error("Please enter a valid account number");
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        withdrawMoney({
          amount: parseFloat(amount),
          bankDetails: {
            accountNumber,
            ifscCode,
            accountHolderName,
          },
        })
      ).unwrap();
      toast.success("Withdrawal request submitted successfully");
      onHide();
    } catch (error) {
      toast.error(error.message || "Failed to process withdrawal");
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
          <h2 className="text-base font-bold text-white mb-4">
            Withdraw Money
          </h2>
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
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Available Balance: ₹{balance}
              </p>
            </div>

            <div>
              <label
                htmlFor="accountHolderName"
                className="block text-xs font-medium text-gray-400 mb-2"
              >
                Account Holder Name
              </label>
              <input
                type="text"
                id="accountHolderName"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter account holder name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="accountNumber"
                className="block text-xs font-medium text-gray-400 mb-2"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter account number"
                required
              />
            </div>

            <div>
              <label
                htmlFor="ifscCode"
                className="block text-xs font-medium text-gray-400 mb-2"
              >
                IFSC Code
              </label>
              <input
                type="text"
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm bg-[#252525] border border-[#303030] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter IFSC code"
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
                disabled={
                  loading ||
                  !formData.amount ||
                  parseFloat(formData.amount) > balance ||
                  !formData.accountNumber ||
                  !formData.ifscCode ||
                  !formData.accountHolderName
                }
                className={`px-4 py-2 text-sm bg-[#f1c40f] text-black font-semibold rounded-lg hover:bg-[#f2c50f] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] ${
                  loading ||
                  !formData.amount ||
                  parseFloat(formData.amount) > balance ||
                  !formData.accountNumber ||
                  !formData.ifscCode ||
                  !formData.accountHolderName
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading ? "Processing..." : "Withdraw Now"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;
