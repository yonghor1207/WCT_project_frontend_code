import React, { useState } from "react";
import { Plus, DollarSign, TrendingUp, XCircle, Clock } from "lucide-react";
import PaymentTable from "../Payment/paymentTable"; // Fixed import name to match component name

const PaymentDashboard = () => {
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Sample data
  const paymentStats = {
    totalRevenue: 125840,
    pendingPayments: 23,
    completedToday: 45,
    overduePayments: 8,
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AddPaymentModal = () => (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg p-6 w-full max-w-4xl mx-4">
        <h3 className="text-lg font-semibold mb-4">Add New Payment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select</option>
              <option>Semester 1</option>
              <option>Semester 2</option>
              <option>Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Methods
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select</option>
              <option>Credit Card</option>
              <option>Paypal</option>
              <option>ABA</option>
              <option>Acleda</option>
              <option>Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowAddPayment(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowAddPayment(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Payment
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment Management
              </h1>
              <p className="text-gray-600">Manage student payments and fees</p>
            </div>
            <button
              onClick={() => setShowAddPayment(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${paymentStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-500"
          />
          <StatCard
            title="Pending Payments"
            value={paymentStats.pendingPayments}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatCard
            title="Completed Today"
            value={paymentStats.completedToday}
            icon={TrendingUp}
            color="bg-blue-500"
          />
          <StatCard
            title="Overdue Payments"
            value={paymentStats.overduePayments}
            icon={XCircle}
            color="bg-red-500"
          />
        </div>
        {/* Navigation Tabs */}
        <PaymentTable />{" "}
        {/* Fixed component name to use proper capitalization */}
      </div>

      {/* Add Payment Modal */}
      {showAddPayment && <AddPaymentModal />}
    </div>
  );
};

export default PaymentDashboard;
