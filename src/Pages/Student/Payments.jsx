import { useState } from "react";
import {
  DollarSign,
  CheckCircle,
  Clock,
  CreditCard,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useGetPaymentQuery } from "../../redux/hooks/paymentApiSlice";

const StudentPayments = () => {
  const [filterStatus, setFilterStatus] = useState("all"); // all, paid, pending, overdue
  const [viewMode, setViewMode] = useState("overview"); // overview, history

  const { data: paymentResponse, isLoading } = useGetPaymentQuery();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading payments...</div>
      </div>
    );
  }

  const allPayments = paymentResponse?.data || [];

  // Filter payments for current student (in real app, filter by logged-in student ID)
  const myPayments = allPayments;

  const filteredPayments = filterStatus === "all"
    ? myPayments
    : myPayments.filter(p => {
        if (filterStatus === "paid") return p.status === "verified" || p.status === "paid";
        if (filterStatus === "pending") return p.status === "pending";
        if (filterStatus === "overdue") {
          const dueDate = new Date(p.due_date);
          return dueDate < new Date() && p.status !== "verified" && p.status !== "paid";
        }
        return true;
      });

  // Calculate statistics
  const totalAmount = myPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const paidAmount = myPayments
    .filter(p => p.status === "verified" || p.status === "paid")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const pendingAmount = myPayments
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const overduePayments = myPayments.filter(p => {
    const dueDate = new Date(p.due_date);
    return dueDate < new Date() && p.status !== "verified" && p.status !== "paid";
  });

  const exportPayments = () => {
    const headers = ["Date", "Description", "Amount", "Status", "Due Date"];
    const rows = filteredPayments.map(payment => [
      new Date(payment.created_at).toLocaleDateString(),
      payment.description || "Payment",
      `$${parseFloat(payment.amount).toFixed(2)}`,
      payment.status,
      new Date(payment.due_date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_payments.csv";
    a.click();
    toast.success("Payments exported successfully");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Payments</h1>
          <p className="text-gray-600">View and manage your payment history</p>
        </div>
      </div>

      {/* Overdue Alert */}
      {overduePayments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Overdue Payments</h3>
              <p className="text-sm text-red-700 mb-2">
                You have {overduePayments.length} overdue payment(s). Please make payment as soon as possible.
              </p>
              <div className="flex flex-wrap gap-2">
                {overduePayments.slice(0, 3).map((payment, idx) => (
                  <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    ${parseFloat(payment.amount).toFixed(2)} - Due {new Date(payment.due_date).toLocaleDateString()}
                  </span>
                ))}
                {overduePayments.length > 3 && (
                  <span className="text-xs text-red-700">
                    +{overduePayments.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Amount</p>
              <p className="text-3xl font-bold">${totalAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Paid</p>
              <p className="text-3xl font-bold">${paidAmount.toFixed(2)}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
              <p className="text-3xl font-bold">${pendingAmount.toFixed(2)}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Overdue</p>
              <p className="text-3xl font-bold">{overduePayments.length}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-200" />
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setViewMode("overview")}
            className={`flex-1 px-6 py-4 font-medium transition ${
              viewMode === "overview"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode("history")}
            className={`flex-1 px-6 py-4 font-medium transition ${
              viewMode === "history"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Payment History
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "overview" ? (
        <OverviewView 
          myPayments={myPayments}
          paidAmount={paidAmount}
          totalAmount={totalAmount}
        />
      ) : (
        <HistoryView 
          filteredPayments={filteredPayments}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />
      )}
    </div>
  );
};

const OverviewView = ({ myPayments, paidAmount, totalAmount }) => {
  const recentPayments = myPayments.slice(0, 5);
  const paymentRate = totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : 0;

  // Monthly payment data
  const monthlyData = myPayments.reduce((acc, payment) => {
    const month = new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { paid: 0, pending: 0, total: 0 };
    }
    const amount = parseFloat(payment.amount);
    acc[month].total += amount;
    if (payment.status === "verified" || payment.status === "paid") {
      acc[month].paid += amount;
    } else {
      acc[month].pending += amount;
    }
    return acc;
  }, {});

  const months = Object.keys(monthlyData).slice(-6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Progress */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Progress</h2>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Payment Rate</span>
            <span className="text-sm font-bold text-gray-900">{paymentRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
              style={{ width: `${paymentRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>${paidAmount.toFixed(2)} paid</span>
            <span>${totalAmount.toFixed(2)} total</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">Payment Status</h3>
                <p className="text-sm text-gray-700">
                  {paymentRate >= 90 
                    ? "Excellent! You're up to date with your payments."
                    : paymentRate >= 75
                    ? "Good progress. Keep up with your payments."
                    : "Please ensure timely payments to avoid penalties."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Payments</h2>
        {recentPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No payment records yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    payment.status === "verified" || payment.status === "paid"
                      ? "bg-green-100"
                      : payment.status === "pending"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      payment.status === "verified" || payment.status === "paid"
                        ? "text-green-600"
                        : payment.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === "verified" || payment.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status === "verified" ? "Paid" : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Payment Trend</h2>
        {months.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No monthly data available</p>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between gap-2 h-64">
              {months.map((month) => {
                const data = monthlyData[month];
                const maxHeight = Math.max(...months.map(m => monthlyData[m].total));
                const height = (data.total / maxHeight) * 100;

                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col-reverse gap-1 h-48">
                      <div
                        className="bg-green-500 rounded-t"
                        style={{ height: `${(data.paid / data.total) * height}%` }}
                        title={`Paid: $${data.paid.toFixed(2)}`}
                      />
                      <div
                        className="bg-yellow-500"
                        style={{ height: `${(data.pending / data.total) * height}%` }}
                        title={`Pending: $${data.pending.toFixed(2)}`}
                      />
                    </div>
                    <span className="text-xs text-gray-600 text-center">{month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const HistoryView = ({ filteredPayments, filterStatus, setFilterStatus }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.description || "Payment"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  ${parseFloat(payment.amount).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === "verified" || payment.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status === "verified" ? "Paid" : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentPayments;
