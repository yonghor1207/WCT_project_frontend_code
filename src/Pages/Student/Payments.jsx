import { useState } from "react";
import { useGetUserQuery, useUpdatePaymentStatusMutation } from "../../redux/hooks/userApiSlice";
import { toast } from "react-toastify";

const StudentPayments = () => {
  const { data: userResponse, isLoading, refetch } = useGetUserQuery();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    year: "",
    semester: "",
  });

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const allUsers = userResponse?.data?.data || userResponse?.data || [];
  const students = Array.isArray(allUsers) ? allUsers.filter(user => user.role === 'student') : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.year || !formData.semester) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the student by first name and last name
      const student = students.find(
        s => s.first_name.toLowerCase() === formData.firstName.toLowerCase() && 
             s.last_name.toLowerCase() === formData.lastName.toLowerCase()
      );

      if (!student) {
        toast.error("Student not found. Please check your name and try again.");
        setIsSubmitting(false);
        return;
      }

      // Determine payment status based on semester
      const paymentStatus = formData.semester === "1" ? "pending" : "pending_semester_2";

      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error("You must be logged in to submit a payment request");
        setIsSubmitting(false);
        return;
      }

      // Update the student's year and payment status using the admin API
      const updateResponse = await fetch(`http://127.0.0.1:8000/api/admin/users/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          role: student.role,
          year: formData.year,
          class: student.class,
          payment_status: paymentStatus,
          status: student.status
        })
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update payment request');
      }
      
      await refetch();
      
      toast.success(`Payment request submitted successfully! Year updated to ${formData.year} and status set to ${formData.semester === "1" ? "Pending for Semester 1" : "Pending for Semester 2"}`);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        year: "",
        semester: "",
      });
    } catch (error) {
      console.error("Failed to submit payment request:", error);
      const errorMessage = error?.message || "Failed to submit payment request. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Create Payment Request</h1>
          <p className="text-gray-600 mt-1">Fill in your information to submit a payment request</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter last name"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester <span className="text-red-500">*</span>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  firstName: "",
                  lastName: "",
                  year: "",
                  semester: "",
                });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentPayments;
