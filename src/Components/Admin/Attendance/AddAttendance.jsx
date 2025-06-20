import { useState, useEffect } from "react";
import { ArrowLeft, Save, Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../redux/hooks/userApiSlice";
import {
    useCreateAttendanceMutation,
    useGetAttendanceByIdQuery,
    useGetAttendanceQuery,
    useUpdateAttendanceMutation
} from "../../../redux/hooks/attendaceApiSlice";
import { useGetClassroomQuery } from "../../../redux/hooks/classroomApiSlice";
import { useGetCourseQuery } from "../../../redux/hooks/courseApiSlice";

const AddAttendance = () => {
    const [errors, setErrors] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        student_id: "",
        classroom_id: "",
        course_id: "",
        attendance_date: new Date().toISOString().split('T')[0],
        status: "not_mark",
    });

    const [createAttendance] = useCreateAttendanceMutation();
    const [updateAttendance] = useUpdateAttendanceMutation();
    const { refetch } = useGetAttendanceQuery();
    const { data: studentData } = useGetUserQuery();
    const { data: classroomData } = useGetClassroomQuery();
    const { data: courseData } = useGetCourseQuery();

    const students = studentData?.data?.data.filter(user => user.role === 'student') || [];
    console.log("student", students);
    const classrooms = classroomData?.data || [];
    const courses = courseData?.data.data || [];

    // useEffect(() => {
    //     if (existingAttendance?.data && id) {
    //         const attendance = existingAttendance.data;
    //         setIsEditMode(true);
    //         setFormData({
    //             student_id: attendance.user_id,
    //             classroom_id: attendance.classroom_id,
    //             course_id: attendance.course_id,
    //             attendance_date: attendance.attendance_date.split(' ')[0],
    //         });
    //     }
    // }, [id, existingAttendance]);

    const validate = () => {
        const errors = {};
        if (!formData.student_id) errors.student_id = 'Student is required';
        if (!formData.classroom_id) errors.classroom_id = 'Classroom is required';
        if (!formData.course_id) errors.course_id = 'Course is required';
        if (!formData.attendance_date) errors.attendance_date = 'Date is required';
        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const cancel = () => {
        navigate('/attendance');
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            // Prepare the exact data structure backend expects
            const attendanceData = {
                student_id: Number(formData.student_id),
                classroom_id: Number(formData.classroom_id),
                course_id: Number(formData.course_id),
                attendance_date: `${formData.attendance_date} 08:00:00`,
                status: formData.status
            };

            console.log("Final payload to backend:", attendanceData);

            await createAttendance(attendanceData).unwrap();
            toast.success("Attendance created successfully!");
            await refetch();
            navigate('/attendance');
        } catch (error) {
            console.error("Detailed API error:", {
                status: error.status,
                data: error.data,
                originalError: error
            });
            toast.error(error.data?.message || "Failed to create attendance");
        }
    };

    const statusOptions = [
        { value: 'present', label: 'Present' },
        { value: 'absent', label: 'Absent' },
        { value: 'late', label: 'Late' },
        { value: 'not_mark', label: 'Not Mark' }
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
                                    {isEditMode ? 'Edit Attendance' : 'Add New Attendance'}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-8">
                                <div className="bg-indigo-600 text-white px-4 py-3 rounded-t-lg">
                                    <h3 className="font-medium">Attendance Details</h3>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-b-lg border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Student Selection */}
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Student *
                                            </label>
                                            <select
                                                name="student_id"
                                                value={formData.student_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded border ${errors.student_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required
                                            >
                                                <option value="">Select a student</option>
                                                {students.map((student) => (
                                                    <option key={student.id} value={student.id}>
                                                        {`${student.first_name} ${student.last_name}`}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.student_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.student_id}</p>
                                            )}
                                        </div>

                                        {/* Classroom Selection */}
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Classroom *
                                            </label>
                                            <select
                                                name="classroom_id"
                                                value={formData.classroom_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded border ${errors.classroom_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required
                                            >
                                                <option value="">Select a classroom</option>
                                                {classrooms.map((classroom) => (
                                                    <option key={classroom.id} value={classroom.id}>
                                                        {classroom.class_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.classroom_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.classroom_id}</p>
                                            )}
                                        </div>

                                        {/* Course Selection */}
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Course *
                                            </label>
                                            <select
                                                name="course_id"
                                                value={formData.course_id}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 rounded border ${errors.course_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                required
                                            >
                                                <option value="">Select a course</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.course_id && (
                                                <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>
                                            )}
                                        </div>

                                        {/* Status Selection */}
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Status *
                                            </label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Date Input */}
                                        <div>
                                            <label className="block text-sm text-start font-medium text-gray-700 mb-2">
                                                Date *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    name="attendance_date"
                                                    value={formData.attendance_date}
                                                    onChange={handleDateTimeChange}
                                                    className={`w-full pl-10 pr-3 py-2 rounded border ${errors.attendance_date ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    required
                                                />
                                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            </div>
                                            {errors.attendance_date && (
                                                <p className="mt-1 text-sm text-red-600">{errors.attendance_date}</p>
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

export default AddAttendance;