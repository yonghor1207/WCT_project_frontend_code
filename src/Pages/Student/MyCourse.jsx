import { useState } from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  User,
  TrendingUp,
  Search,
} from "lucide-react";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";
import { useGetAttendanceQuery } from "../../redux/hooks/attendaceApiSlice";

const MyCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: coursesResponse, isLoading, isError } = useGetCourseQuery();
  const { data: attendanceResponse } = useGetAttendanceQuery();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading your courses...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading courses</div>
      </div>
    );
  }

  const courses = coursesResponse?.data?.data || coursesResponse?.data || [];
  const attendanceRecords = attendanceResponse?.data || [];
  
  // Get current user ID from localStorage or auth context
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;
  
  // Calculate progress for each course based on attendance
  const calculateCourseProgress = (courseId) => {
    const courseAttendance = Array.isArray(attendanceRecords)
      ? attendanceRecords.filter(
          record => record.course_id === courseId && record.student_id === currentUserId
        )
      : [];
    
    if (courseAttendance.length === 0) return 0;
    
    const presentCount = courseAttendance.filter(record => record.status === 'present').length;
    return Math.round((presentCount / courseAttendance.length) * 100);
  };
  
  const filteredCourses = Array.isArray(courses) 
    ? courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Track your enrolled courses and progress
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-purple-600" />}
          title="Enrolled Courses"
          value={courses.length}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          title="Active Courses"
          value={courses.filter(c => c.status === 1).length}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-blue-600" />}
          title="Total Hours"
          value={courses.length * 40} // Assuming 40 hours per course
          bgColor="bg-blue-50"
        />
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No courses found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search"
              : "You haven't enrolled in any courses yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              progress={calculateCourseProgress(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, progress }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{course.name}</h3>
        <p className="text-purple-100 text-sm line-clamp-2">
          {course.description || "No description available"}
        </p>
      </div>

      {/* Course Body */}
      <div className="p-6">
        {/* Course Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span>Instructor: {course.instructor || "TBA"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Duration: {course.duration || "8 weeks"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              Start: {new Date(course.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-purple-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              course.status === 1
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {course.status === 1 ? "Active" : "Inactive"}
          </span>
          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCourse;
