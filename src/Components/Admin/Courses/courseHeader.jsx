import React, { useState } from "react";
import { Plus, BookOpen, Users, GraduationCap, Clock } from "lucide-react";
import CourseTable from "./courseTable";

const CourseHeader = () => {
  const [showAddCourse, setShowAddCourse] = useState(false);

  // Sample data
  const courseStats = {
    totalCourses: 48,
    activeCourse: 235,
    totalTeacher: 16,
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AddCourseModal = () => (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg p-6 w-full max-w-4xl mx-4">
        <h3 className="text-lg font-semibold mb-4">Add New Course</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Techer ID
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => setShowAddCourse(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowAddCourse(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Course
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <p className="text-2xl font-bold ">
                Course Management
              </p>
              <p className="text-gray-600">
                Manage academic courses and programs
              </p>
            </div>
            <button
              onClick={() => setShowAddCourse(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Course
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={courseStats.totalCourses}
            icon={BookOpen}
            color="bg-green-500"
          />
          <StatCard
            title="Active Course"
            value={courseStats.activeCourse}
            icon={BookOpen}
            color="bg-yellow-500"
          />
          <StatCard
            title="Total Teacher"
            value={courseStats.totalTeacher}
            icon={GraduationCap}
            color="bg-purple-500"
          />
        </div>

        {/* Navigation Tabs */}
        <CourseTable />
      </div>

      {/* Add Course Modal */}
      {showAddCourse && <AddCourseModal />}
    </div>
  );
};

export default CourseHeader;
