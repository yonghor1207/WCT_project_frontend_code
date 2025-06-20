import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import { data, useNavigate, useParams } from "react-router-dom";
import { useCreateClassroomMutation, useGetClassroomByIdQuery, useGetClassroomQuery, useUpdateClassroomMutation } from "../../../redux/hooks/classroomApiSlice";

const AddClassroom = () => {
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        class_name: "",
    });

    const [createClassroom] = useCreateClassroomMutation();
    const [updateClassroom] = useUpdateClassroomMutation();
    const { refetch } = useGetClassroomQuery();
    const { data: existingClassroom } = useGetClassroomByIdQuery(id)

    console.log("exist classroom:", existingClassroom);

    useEffect(() => {
        console.log("Existing classroom data:", existingClassroom); // Debug log
        if (existingClassroom && id) {
            setIsEditMode(true);
            setFormData({
                class_name: existingClassroom.class_name || "",
            });
        }
    }, [id, existingClassroom]);

    const validate = () => {
        const errors = {};
        if (!formData.class_name) errors.class_name = 'Classroom Name is required';
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
        navigate('/classroom');
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
                await updateClassroom({ id, data: formData }).unwrap();
                toast.success('classroom updated successfully!');
            } else {
                const data = {
                    ...formData
                };
                await createClassroom(data).unwrap();
                toast.success('classroom created successfully!');
            }

            await refetch();
            navigate('/classroom');
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
                                    {isEditMode ? 'Edit classroom' : 'Add New classroom'}
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
                                    <h3 className="font-medium">Classroom Detail</h3>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-b-lg border border-gray-200">
                                    <div className="grid grid-cols-1">
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Classroom Name {!isEditMode && '*'}
                                            </label>
                                            <input
                                                type="text"
                                                name="class_name"
                                                value={formData.class_name}
                                                onChange={handleInputChange}
                                                placeholder="Enter first name..."
                                                className={`w-full px-3 py-2 border ${errors.class_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required={!isEditMode}
                                            />
                                            {errors.class_name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.class_name}</p>
                                            )}
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

export default AddClassroom;