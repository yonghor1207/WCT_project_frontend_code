import { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateCourseMutation, useGetCourseByIdQuery, useGetCourseQuery, useUpdateCourseMutation } from "../../../redux/hooks/courseApiSlice";
import { useGetUserQuery } from "../../../redux/hooks/userApiSlice";


const AddCourse = () => {
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        teacher_id: "",
        status: 1,
    });

    const [createCourse] = useCreateCourseMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const { refetch } = useGetCourseQuery();
    const { data: teacherData } = useGetUserQuery();
    const teachers = teacherData?.data.data.filter(user => user.role === 'teacher') || [];
    console.log("teacher data ", teachers)
    const { data: existingCourse } = useGetCourseByIdQuery(id)

    console.log("exist course:", existingCourse);

    useEffect(() => {
        console.log("Existing course data:", existingCourse); // Debug log
        if (existingCourse?.data?.length > 0 && id) {
            const course = existingCourse.data[0]; // Get first item from array
            setIsEditMode(true);
            setFormData({
                name: course.name || "",
                description: course.description || "",
                teacher_id: course.teacher_id || "",
            });
        }
    }, [id, existingCourse]);

    const validate = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Course Name is required';
        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'teacher_id' ? Number(value) : value,
        }));
    };

    const cancel = () => {
        navigate('/course');
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
                await updateCourse({ id, data: formData }).unwrap();
                toast.success('course updated successfully!');
            } else {
                const data = {
                    ...formData
                };
                await createCourse(data).unwrap();
                toast.success('course created successfully!');
            }

            await refetch();
            navigate('/course');
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
                                    {isEditMode ? 'Edit course' : 'Add New course'}
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
                                    <h3 className="font-medium">Course Detail</h3>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-b-lg border border-gray-200">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Course Name {!isEditMode && '*'}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter first name..."
                                                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required={!isEditMode}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Teacher {!isEditMode && '*'}
                                            </label>

                                            <select
                                                name="teacher_id"
                                                value={formData.teacher_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded border ${errors.teacher_id ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required={!isEditMode}
                                            >
                                                <option value="">Select a teacher</option>
                                                {teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {`${teacher.first_name} ${teacher.last_name}`}
                                                    </option>
                                                ))}
                                            </select>

                                            {errors.teacher_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
                                            )}
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-1 mt-5">
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Classroom Name {!isEditMode && '*'}
                                            </label>
                                            <textarea
                                                type="text"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Enter Description..."
                                                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required={!isEditMode}
                                            />
                                            {errors.description && (
                                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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

export default AddCourse;