import React from "react";
import {
  Building2,
  CheckCircle,
  Users,
  AlertTriangle,
} from "lucide-react";

const ClassroomFooter = ({ classrooms }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Classrooms</p>
            <p className="text-2xl font-bold text-gray-900">
              {classrooms.length}
            </p>
          </div>
          <Building2 className="text-blue-600" size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-bold text-green-600">
              {classrooms.filter((c) => c.status === "available").length}
            </p>
          </div>
          <CheckCircle className="text-green-600" size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Occupied</p>
            <p className="text-2xl font-bold text-blue-600">
              {classrooms.filter((c) => c.status === "occupied").length}
            </p>
          </div>
          <Users className="text-blue-600" size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Maintenance</p>
            <p className="text-2xl font-bold text-red-600">
              {classrooms.filter((c) => c.status === "maintenance").length}
            </p>
          </div>
          <AlertTriangle className="text-red-600" size={24} />
        </div>
      </div>
    </div>
  );
};

export default ClassroomFooter;