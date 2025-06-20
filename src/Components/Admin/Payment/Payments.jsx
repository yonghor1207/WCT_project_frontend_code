import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, BookOpen, GraduationCap, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeactivatedCourseMutation, useGetCourseQuery } from "../../../redux/hooks/courseApiSlice";
import PaymentTableComponent from "./PaymentTableComponent";
import StatCard from "../Courses/StatCard";
import { useGetPaymentQuery, useVerifyPaymentMutation } from "../../../redux/hooks/paymentApiSlice";

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPayment, setSelectedPayment] = useState(null);
    const navigate = useNavigate();

    const { data: paymentData, isLoading, refetch } = useGetPaymentQuery();
    const [payments, setPayments] = useState([]);
    console.log("payment data:", paymentData?.data);
    useEffect(() => {
        if (paymentData?.data) {
            setPayments(paymentData.data);
        }
    }, [paymentData]);

    const filteredPayments = Array.isArray(payments)
        ? payments.filter((payment) => // Fixed typo in variable name (was courese)
            `${payment.amount ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${payment.student?.first_name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${payment.student?.last_name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleEdit = (payment) => { // Fixed typo in parameter name
        console.log("payment id:", payment.id);
        navigate(`${payment.id}`);
    };

    const totalPayments = useMemo(() =>
        payments
            .filter(payment => payment.status === 'paid')
            .reduce((total, payment) => total + (Number(payment.amount) || 0), 0),
        [payments]
    );


    const [verifyPayment] = useVerifyPaymentMutation();

    const handleToggleStatus = async (paymentID) => {
        setSelectedPayment(paymentID); // Changed from setSelectedStudent
        try {
            if (!paymentID) {
                toast.error("Course not found");
                return;
            }
            await verifyPayment(paymentID).unwrap();
            await refetch();
            toast.success("Status updated successfully!", {
                position: "top-right"
            });
        } catch (error) {
            toast.error("Failed to update payment status!");
            console.error("Failed to toggle payment status:", error);
        }
    };

    const addNew = () => {
        navigate("createPayment"); // Changed from createStudent
    };

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Payment Management
                        </h1>
                        <p className="text-gray-600">Manage your payments efficiently</p>
                    </div>
                    <button
                        onClick={addNew}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Payment
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search payments by name or teacher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title={"Total Payments"}
                        color={"bg-blue-500"}
                        value={Number(totalPayments)}
                        icon={DollarSign}
                    />
                    <StatCard
                        title={"Total Student"}
                        color={"bg-purple-500"}
                        value={[...new Set(payments.map(payment => payment.student?.id))].length}
                        icon={GraduationCap}
                    />
                </div>

                {/* Course Table */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : filteredPayments.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {searchTerm ? "No matching payments found" : "No payments available"}
                    </div>
                ) : (
                    <PaymentTableComponent
                        payments={filteredPayments}
                        onEdit={handleEdit}
                        onToggleStatus={handleToggleStatus}
                    />
                )}
            </div>
        </div>
    );
};

export default Payments;