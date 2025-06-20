import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const PaymentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [recentPayments, setRecentPayments] = useState([
    {
      transitionID: "transition001",
      studentName: "John Smith",
      paymentType: "Semester 2",
      amount: "$100.00",
      paymentMethod: "Credit Card",
      dueDate: "2024-01-15",
      status: "paid",
    },
    {
      transitionID: "transition002",
      studentName: "Emma Johnson",
      paymentType: "Semester 2",
      amount: "$100.00",
      paymentMethod: "Paypal",
      dueDate: "2024-01-20",
      status: "pending",
    },
    {
      transitionID: "transition003",
      studentName: "Michael Brown",
      paymentType: "Yearly",
      amount: "$100.00",
      paymentMethod: "Acleda",
      dueDate: "2024-01-10",
      status: "Failed",
    },
    {
      transitionID: "transition004",
      studentName: "Sarah Wilson",
      paymentType: "Semester 1",
      amount: "$100.00",
      paymentMethod: "Credit Card",
      dueDate: "2024-01-18",
      status: "paid",
    },
    {
      transitionID: "transition005",
      studentName: "David Lee",
      paymentType: "Semester 2",
      amount: "$100.00",
      paymentMethod: "ABA",
      dueDate: "2024-01-25",
      status: "pending",
    },
    {
      transitionID: "transition006",
      studentName: "Lisa Anderson",
      paymentType: "Yearly",
      amount: "$100.00",
      paymentMethod: "Credit Card",
      dueDate: "2024-01-22",
      status: "paid",
    },
    {
      transitionID: "transition007",
      studentName: "Tom Martinez",
      paymentType: "Semester 1",
      amount: "$100.00",
      paymentMethod: "Cash",
      dueDate: "2024-01-28",
      status: "pending",
    },
  ]);

  const handleStatusChange = (transitionID, newStatus) => {
    setRecentPayments((prev) =>
      prev.map((payment) =>
        payment.transitionID === transitionID
          ? { ...payment, status: newStatus }
          : payment
      )
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "paid":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Failed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
  };

  const filteredPayments = recentPayments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transitionID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.gradClass.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Payment Table */}
        <div className="rounded-lg shadow-sm">
          <div className="p-6">
            <div className="text-left flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                Payment Records
              </h2>
              <p className="text-gray-600 mb-2">
                Manage and track student payment status
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, payment code, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Transition ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Name Student
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Payment Type
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Payment Method
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.transitionID}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                          {payment.transitionID}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {payment.studentName}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-500">
                          {payment.paymentType}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-red-600">
                          {payment.amount}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-500">
                          {payment.paymentMethod}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {payment.dueDate}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <span className={getStatusBadge(payment.status)}>
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {payment.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusChange(payment.transitionID, "paid")
                              }
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs font-medium"
                            >
                              Mark paid
                            </button>
                          )}
                          {payment.status === "paid" && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  payment.transitionID,
                                  "pending"
                                )
                              }
                              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-xs font-medium"
                            >
                              Mark Pending
                            </button>
                          )}
                          {payment.status === "Failed" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    payment.transitionID,
                                    "paid"
                                  )
                                }
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-xs font-medium"
                              >
                                Mark paid
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    payment.transitionID,
                                    "pending"
                                  )
                                }
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-xs font-medium"
                              >
                                Mark Pending
                              </button>
                            </>
                          )}
                          {/* <button
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredPayments.length} of {recentPayments.length}{" "}
              payment records
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
