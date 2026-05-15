import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import PaymentTableComponent from "./PaymentTableComponent";
import { useGetUserQuery, useDeleteUserMutation, useUpdatePaymentStatusMutation, useUpdateUserMutation } from "../../../redux/hooks/userApiSlice";

const Payments = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: userData, isLoading, refetch } = useGetUserQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
    const [updateUser] = useUpdateUserMutation();
    const [students, setStudents] = useState([]);

    console.log("userData:", userData);

    useEffect(() => {
        if (userData?.data?.data) {
            // Filter users with role === 'student'
            const studentOnly = userData.data.data.filter(
                (user) => user.role === "student"
            );
            setStudents(studentOnly);
        }
    }, [userData]);

    const filteredStudents = useMemo(() => {
        if (!Array.isArray(students)) return [];
        
        return students.filter((student) => {
            const matchesSearch = 
                `${student.first_name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${student.last_name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${student.email ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${student.department ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${student.class ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" || student.payment_status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [students, searchTerm, statusFilter]);

    const handleStatusChange = async (studentId, newStatus) => {
        try {
            await updatePaymentStatus({ id: studentId, payment_status: newStatus }).unwrap();
            await refetch();
            toast.success("Payment status updated successfully!", {
                position: "top-right"
            });
        } catch (error) {
            toast.error("Failed to update payment status!");
            console.error("Failed to update payment status:", error);
        }
    };

    const handleClassChange = async (studentId, newClass) => {
        // Optimistic update
        setStudents(prevStudents => 
            prevStudents.map(student => 
                student.id === studentId ? { ...student, class: newClass } : student
            )
        );

        try {
            await updateUser({ id: studentId, data: { class: newClass } }).unwrap();
            await refetch();
            toast.success("Class updated successfully!", {
                position: "top-right"
            });
        } catch (error) {
            // Revert on error
            await refetch();
            toast.error("Failed to update class!");
            console.error("Failed to update class:", error);
        }
    };

    const handleYearChange = async (studentId, newYear) => {
        // Optimistic update
        setStudents(prevStudents => 
            prevStudents.map(student => 
                student.id === studentId ? { ...student, year: newYear } : student
            )
        );

        try {
            await updateUser({ id: studentId, data: { year: newYear } }).unwrap();
            await refetch();
            toast.success("Year updated successfully!", {
                position: "top-right"
            });
        } catch (error) {
            // Revert on error
            await refetch();
            toast.error("Failed to update year!");
            console.error("Failed to update year:", error);
        }
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {
            await deleteUser(studentId).unwrap();
            await refetch();
            toast.success("Student deleted successfully!", {
                position: "top-right"
            });
        } catch (error) {
            toast.error("Failed to delete student!");
            console.error("Failed to delete student:", error);
        }
    };

    return (
        <div>
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Student Payment Management
                    </h1>
                    <p className="text-gray-600">View and manage student payment status</p>
                </div>

                {/* Search and Status Filters */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, department, class..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    {/* Status Filter Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter("paid_1_semester")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === "paid_1_semester"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Paid 1 Sem
                        </button>
                        <button
                            onClick={() => setStatusFilter("paid_2_semester")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === "paid_2_semester"
                                    ? "bg-green-700 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Paid 2 Sem
                        </button>
                        <button
                            onClick={() => setStatusFilter("pending")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === "pending"
                                    ? "bg-yellow-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setStatusFilter("not_yet")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === "not_yet"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Not Yet
                        </button>
                    </div>
                </div>

                {/* Student Table */}
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading...</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        {searchTerm || statusFilter !== "all" ? "No matching students found" : "No students available"}
                    </div>
                ) : (
                    <PaymentTableComponent
                        students={filteredStudents}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                        onClassChange={handleClassChange}
                        onYearChange={handleYearChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Payments;