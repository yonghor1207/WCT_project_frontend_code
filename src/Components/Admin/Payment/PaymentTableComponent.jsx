import { Edit3, UserCheck, UserX, User, CheckCircle, XCircle } from "lucide-react";

const PaymentTableComponent = ({
    payments,
    onEdit,
    onToggleStatus,
}) => {


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
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Transaction ID</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Student Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment Type</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment Method</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>

                    {/* List */}
                    <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => {
                            const isPaid = payment.status === "paid";

                            return (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors text-start">

                                    <td className="py-4 px-6 text-gray-700 text-start font-semibold">{payment.transaction_id}</td>
                                    <td className="py-4 px-6 text-gray-700">{`${payment.student?.first_name} ${payment.student?.last_name}`}</td>
                                    <td className="py-4 px-6 text-blue-600 text-start">${payment.amount}</td>
                                    <td className="py-4 px-6 text-blue-600 text-start capitalize">{payment.payment_type}</td>
                                    <td className="py-4 px-6 text-blue-600 text-start uppercase">{payment.payment_method}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={getStatusBadge(payment.status)}
                                        >
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onEdit(payment)}
                                                className="p-2 text-gid: 6, firstName: 'Sarah', lastName: 'Miller', grade: '11th', rolray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="Edit payment"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onToggleStatus(payment.id)}
                                                className={`p-2 rounded-lg transition-colors ${isPaid
                                                    ? "text-red-600 hover:bg-red-50"
                                                    : "text-green-600 hover:bg-green-50"
                                                    }`}
                                            >
                                                {isPaid ? (
                                                    <XCircle className="w-4 h-4" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTableComponent;
