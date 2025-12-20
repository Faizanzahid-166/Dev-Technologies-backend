import React, { useState, useEffect } from "react";
import { deposit, withdraw, transfer, getMyTransactions } from "../../api/paymentApi.js";

const PaymentPage = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const data = await getMyTransactions();
    setTransactions(data.transactions);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDeposit = async () => {
    await deposit(Number(depositAmount));
    setDepositAmount(""); // reset input
    fetchTransactions();
  };

  const handleWithdraw = async () => {
    await withdraw(Number(withdrawAmount));
    setWithdrawAmount("");
    fetchTransactions();
  };

  const handleTransfer = async () => {
    await transfer(targetUser, Number(transferAmount));
    setTransferAmount("");
    setTargetUser("");
    fetchTransactions();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Payment Section</h2>

      {/* Deposit */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-2">Deposit</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          className="border rounded px-3 py-2 w-48 mr-2"
          placeholder="Amount"
        />
        <button
          onClick={handleDeposit}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Deposit
        </button>
      </div>

      {/* Withdraw */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-2">Withdraw</h3>
        <input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="border rounded px-3 py-2 w-48 mr-2"
          placeholder="Amount"
        />
        <button
          onClick={handleWithdraw}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Withdraw
        </button>
      </div>

      {/* Transfer */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-2">Transfer</h3>
        <input
          type="text"
          value={targetUser}
          onChange={(e) => setTargetUser(e.target.value)}
          className="border rounded px-3 py-2 w-48 mr-2"
          placeholder="Target User ID"
        />
        <input
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="border rounded px-3 py-2 w-48 mr-2"
          placeholder="Amount"
        />
        <button
          onClick={handleTransfer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Transfer
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-2">My Transactions</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td className="border px-2 py-1">{t.type}</td>
                <td className="border px-2 py-1">${t.amount}</td>
                <td className="border px-2 py-1">{t.status}</td>
                <td className="border px-2 py-1">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
