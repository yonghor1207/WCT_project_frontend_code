import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../redux/hooks/userApiSlice";
import { useCreatePaymentMutation, useGetPaymentByIdQuery, useGetPaymentQuery, useUpdatePaymentMutation } from "../../../redux/hooks/paymentApiSlice";
import { useGetClassroomByIdQuery } from "../../../redux/hooks/classroomApiSlice";


const AddPayment = () => {
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        amount: 0,
        user_id: "",
        payment_method: "cash",
        payment_type: "",
        status: "pending",
    });

    const [createPayment] = useCreatePaymentMutation();
    const [updatePayment] = useUpdatePaymentMutation();
    const { refetch } = useGetPaymentQuery();
    const { data: studentData } = useGetUserQuery();
    const students = studentData?.data.data.filter(user => user.role === 'student') || [];
    console.log("student data ", students)
    const { data: existingPayment } = useGetPaymentByIdQuery(id)

    console.log("exist payment:", existingPayment);

    useEffect(() => {
        console.log("Existing payment data:", existingPayment); // Debug log
        if (existingPayment?.data?.length > 0 && id) {
            const payment = existingPayment.data[0];
            setIsEditMode(true);
            setFormData({
                amount: payment.amount || "",
                payment_method: payment.payment_method || "",
                user_id: payment.user_id || "",
                payment_type: payment.payment_type || "",
            });
        }
    }, [id, existingPayment]);

    const validate = () => {
        const errors = {};
        if (!formData.amount) errors.amount = 'Amount is required';
        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'user_id' ? Number(value) : value,
        }));
    };

    const cancel = () => {
        navigate('/payment');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (isEditMode) {
                await updatePayment({ id, data: formData }).unwrap();
                toast.success('Payment updated successfully!');
            } else {
                const data = {
                    ...formData
                };
                await createPayment(data).unwrap();
                toast.success('Payment created successfully!');
            }

            await refetch();
            navigate('/payment');
        } catch (error) {
            toast.error(error.data?.message || error.data || 'An error occurred. Please try again.');
        }
    };

    const paymentMethods = [
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'paypal', label: 'PayPal' },
        { value: 'aba', label: 'ABA' },
        { value: 'acleda', label: 'Acleda' },
        { value: 'cash', label: 'Cash' }
    ];

    const paymentTypes = [
        { value: 'semester1', label: 'Semester 1' },
        { value: 'semester2', label: 'Semester 2' },
        { value: 'yearly', label: 'Yearly' }
    ];

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={cancel}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {isEditMode ? 'Edit Payment' : 'Add New Payment'}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        {/* Personal Details Section */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg">
                                    <h3 className="font-medium">Payment Detail</h3>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-b-lg border border-gray-200">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Student {!isEditMode && '*'}
                                            </label>

                                            <select
                                                name="user_id"
                                                value={formData.user_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded border ${errors.user_id ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required={!isEditMode}
                                            >
                                                <option value="">Select a student</option>
                                                {students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {`${student.first_name} ${student.last_name}`}
                                                    </option>
                                                ))}
                                            </select>

                                            {errors.user_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                                                Payment Type *
                                            </label>
                                            <select
                                                name="payment_type"
                                                value={formData.payment_type || ''}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Select Payment Type</option>
                                                {paymentTypes.map(type => (
                                                    <option key={type.value} value={type.value}>
                                                        {type.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.payment_type && (
                                                <p className="mt-1 text-sm text-red-600">{errors.payment_type}</p>
                                            )}
                                        </div>


                                    </div>
                                    <div className="grid grid-cols-2 mt-5 gap-5">
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Amount {!isEditMode && '*'}
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formData.amount}
                                                onChange={handleInputChange}
                                                placeholder="Enter amount..."
                                                className={`w-full px-3 py-2 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required={!isEditMode}
                                            />
                                            {errors.amount && (
                                                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 text-start">
                                                Payment Methods
                                            </label>
                                            <select
                                                name="payment_method"
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.payment_method || ''}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select</option>
                                                {paymentMethods.map(method => (
                                                    <option key={method.value} value={method.value}>
                                                        {method.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={cancel}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {isEditMode ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPayment;