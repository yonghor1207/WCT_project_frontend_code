import { Edit3, UserCheck, UserX, User } from "lucide-react";

const CourseTableComponent = ({
    courses,
    onEdit,
    onToggleStatus,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">#</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Course Name</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Description</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Instructor</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>

                    {/* List */}
                    <tbody className="divide-y divide-gray-200">
                        {courses.map((course) => {
                            const isActive =
                                course.status === "active" ||
                                course.status === 1 ||
                                course.status === true;

                            return (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors text-start">

                                    <td className="py-4 px-6 text-gray-700 text-start">{course.id}</td>
                                    <td className="py-4 px-6 text-gray-700 text-start">{course.name}</td>
                                    <td className="py-4 px-6 text-blue-600 text-start">{course.description}</td>
                                    <td className="py-4 px-6 text-gray-700">{`${course.teacher?.first_name} ${course.teacher?.last_name}`}</td>
                                    <td className="py-4 px-6">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onEdit(course)}
                                                className="p-2 text-gid: 6, firstName: 'Sarah', lastName: 'Miller', grade: '11th', rolray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                title="Edit course"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onToggleStatus(course.id)}
                                                className={`p-2 rounded-lg transition-colors ${isActive
                                                    ? "text-red-600 hover:bg-red-50"
                                                    : "text-green-600 hover:bg-green-50"
                                                    }`}
                                                title={isActive ? "Deactivate" : "Activate"}
                                            >
                                                {isActive ? (
                                                    <UserX className="w-4 h-4" />
                                                ) : (
                                                    <UserCheck className="w-4 h-4" />
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

export default CourseTableComponent;
