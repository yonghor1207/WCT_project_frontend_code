import React from "react";
import { Eye, Edit3, UserCheck, UserX, User } from "lucide-react";

const StudentTableComponent = ({
  students,
  onEdit,
  onView,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">First Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Phone Number</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>

          {/* List */}
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => {
              const isActive =
                student.status === "active" ||
                student.status === 1 ||
                student.status === true;

              return (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors text-start">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="font-medium text-gray-900">
                        {student.first_name || student.firstName}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700 text-start">{student.last_name || student.lastName}</td>
                  <td className="py-4 px-6 text-blue-600 text-start">{student.email}</td>
                  <td className="py-4 px-6 text-gray-700">{student.phone}</td>
                  <td className="py-4 px-6 text-gray-700 capitalize">{student.role || student.department}</td>
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
                        onClick={() => onEdit(student)}
                        className="p-2 text-gid: 6, firstName: 'Sarah', lastName: 'Miller', grade: '11th', rolray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit student"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(student.id)}
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

export default StudentTableComponent;
