import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useGetUserByIdQuery
} from "../../../redux/hooks/userApiSlice";
import { data, useNavigate, useParams } from "react-router-dom";

const AddStudent = () => {
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    password: "",
    role: "student",
    status: 1
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const { refetch } = useGetUserQuery();
  const { data: existingTeacher } = useGetUserByIdQuery(id)

  console.log("exist student:", existingTeacher);

  useEffect(() => {
    if (existingTeacher) {
      setIsEditMode(true);
      setFormData({
        first_name: existingTeacher.data.first_name || "",
        last_name: existingTeacher.data.last_name || "",
        phone: existingTeacher.data.phone || "",
        email: existingTeacher.data.email || "",
        dob: existingTeacher.data.dob || "",
        gender: existingTeacher.data.gender || "",
        password: existingTeacher.data.password || "",
        role: existingTeacher.data.role || "student",
        status: existingTeacher.data.status || 1
      });
    }
  }, [id, existingTeacher]);

  const validate = () => {
    const errors = {};
    if (!formData.first_name) errors.first_name = 'First Name is required';
    if (!formData.last_name) errors.last_name = 'Last Name is required';
    if (!formData.email) errors.email = 'Email is required';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const cancel = () => {
    navigate('/student');
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
        // If you need to generate a password from first_name and last_name
        const generatedPassword = `${formData.first_name}${formData.last_name}@student-lms2025`;
        // Add the generated password to the formData
        const updatedFormData = {
          ...formData,
          password: generatedPassword
        };
        await updateUser({ id, data: updatedFormData }).unwrap();
        toast.success('Student updated successfully!');
      } else {
        const data = {
          ...formData,
          password: `${formData.first_name}${formData.last_name}@student-lms2025`
        };
        await createUser(data).unwrap();
        toast.success('Student created successfully!');
      }

      await refetch();
      navigate('/student');
    } catch (error) {
      toast.error(error.data?.message || error.data || 'An error occurred. Please try again.');
    }
  };

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
                  {isEditMode ? 'Edit Student' : 'Add New Student'}
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
                  <h3 className="font-medium">Personal Detail</h3>
                </div>

                <div className="bg-gray-50 p-6 rounded-b-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                        First Name {!isEditMode && '*'}
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter first name..."
                        className={`w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        required={!isEditMode}
                      />
                      {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                        Last Name {!isEditMode && '*'}
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Enter last name..."
                        className={`w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        required={!isEditMode}
                      />
                      {errors.last_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                        Email {!isEditMode && '*'}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email address..."
                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        required={!isEditMode}
                        disabled={isEditMode}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Gender...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
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

export default AddStudent;