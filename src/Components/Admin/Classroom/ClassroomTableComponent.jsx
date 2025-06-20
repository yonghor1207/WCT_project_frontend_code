import React from "react";
import { Eye, Edit3, UserCheck, UserX, User, School } from "lucide-react";

const ClassroomTableComponent = ({
  classrooms,
  onEdit,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">#</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Classroom Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>

          {/* List */}
          <tbody className="divide-y divide-gray-200">
            {classrooms.map((classroom) => {

              return (
                <tr key={classroom.id} className="hover:bg-gray-50 transition-colors text-start">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {classroom.id}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex gap-4 items-center">
                    <School  className="text-blue-500"/>
                    <div className="font-medium text-gray-900">
                      {classroom.class_name}
                    </div>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(classroom)}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit classroom"
                      >
                        <Edit3 className="w-4 h-4" />
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

export default ClassroomTableComponent;
