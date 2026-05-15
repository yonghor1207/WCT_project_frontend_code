import { Trash2 } from "lucide-react";

const PaymentTableComponent = ({
    students,
    onDelete,
    onStatusChange,
    onClassChange,
    onYearChange,
}) => {
    const getSelectClass = (status) => {
        const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-1";
        switch (status) {
            case "paid_1_semester":
            case "paid_2_semester":
                return `${baseClasses} bg-green-100 text-green-800 focus:ring-green-500`;
            case "pending":
                return `${baseClasses} bg-yellow-100 text-yellow-800 focus:ring-yellow-500`;
            case "not_yet":
                return `${baseClasses} bg-red-100 text-red-800 focus:ring-red-500`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 focus:ring-gray-500`;
        }
    };

    const getBasicSelectClass = () => {
        return "px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer";
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Class</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Year</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                        </tr>
                    </thead>

                    {/* List */}
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-medium">
                                            {`${student.first_name} ${student.last_name}`}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {student.email}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <select
                                        value={student.class || ""}
                                        onChange={(e) => onClassChange(student.id, e.target.value)}
                                        className={getBasicSelectClass()}
                                    >
                                        <option value="">Select</option>
                                        <option value="M1">M1</option>
                                        <option value="M2">M2</option>
                                        <option value="M3">M3</option>
                                        <option value="M4">M4</option>
                                    </select>
                                </td>
                                <td className="py-4 px-6">
                                    <select
                                        value={student.year || ""}
                                        onChange={(e) => onYearChange(student.id, e.target.value)}
                                        className={getBasicSelectClass()}
                                    >
                                        <option value="">Select</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                    </select>
                                </td>
                                <td className="py-4 px-6">
                                    <select
                                        value={student.payment_status || "not_yet"}
                                        onChange={(e) => onStatusChange(student.id, e.target.value)}
                                        className={getSelectClass(student.payment_status)}
                                    >
                                        <option value="paid_1_semester">Paid 1 Semester</option>
                                        <option value="paid_2_semester">Paid 2 Semester</option>
                                        <option value="pending">Pending</option>
                                        <option value="not_yet">Not Yet</option>
                                    </select>
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        onClick={() => onDelete(student.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete student"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentTableComponent;
