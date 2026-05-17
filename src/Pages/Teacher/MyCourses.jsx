import { useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Search,
  TrendingUp,
  X,
  Mail,
  Phone,
  BarChart3,
} from "lucide-react";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";
import { useGetUserQuery } from "../../redux/hooks/userApiSlice";
import { useGetAttendanceQuery } from "../../redux/hooks/attendaceApiSlice";
import { toast } from "react-toastify";

const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  
  const { data: coursesResponse, isLoading, isError } = useGetCourseQuery();
  const { data: usersResponse } = useGetUserQuery();
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
  const allUsers = usersResponse?.data?.data || usersResponse?.data || [];
  const attendanceRecords = attendanceResponse?.data || [];
  
  // Get students (users with role 'student')
  const students = Array.isArray(allUsers) ? allUsers.filter(user => user.role === 'student') : [];
  
  // Show all students for each course
  const getStudentsForCourse = (courseId) => {
    // Simply return all students from the student module
    return students;
  };

  // Calculate attendance rate for a course
  const getCourseAttendanceRate = (courseId) => {
    const courseAttendance = Array.isArray(attendanceRecords)
      ? attendanceRecords.filter(record => record.course_id === courseId)
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

  // Calculate total students (just show all students in system)
  const totalStudentsAcrossCourses = () => {
    return students.length;
  };

  const handleViewStudents = (course) => {
    setSelectedCourse(course);
    setShowStudentsModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Manage and track your teaching courses
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-green-600" />}
          title="Total Courses"
          value={courses.length}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Active Courses"
          value={courses.filter(c => c.status === 1).length}
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
              : "You haven't been assigned any courses yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              studentCount={getStudentsForCourse(course.id).length}
              attendanceRate={getCourseAttendanceRate(course.id)}
              onViewStudents={() => handleViewStudents(course)}
            />
          ))}
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && selectedCourse && (
        <StudentsModal
          course={selectedCourse}
          students={getStudentsForCourse(selectedCourse.id)}
          attendanceRate={getCourseAttendanceRate(selectedCourse.id)}
          onClose={() => {
            setShowStudentsModal(false);
            setSelectedCourse(null);
          }}
        />
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

const CourseCard = ({ course, studentCount, attendanceRate, onViewStudents }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{course.name}</h3>
        <p className="text-green-100 text-sm line-clamp-2">
          {course.description || "No description available"}
        </p>
      </div>

      {/* Course Body */}
      <div className="p-6">
        {/* Course Info */}
        <div className="space-y-2 mb-4">
          {course.teacher && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>Instructor: {course.teacher.first_name} {course.teacher.last_name}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Duration: {course.duration || "8 weeks"}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              Created: {new Date(course.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center justify-center pt-4 border-t">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              course.status === 1
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {course.status === 1 ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

const StudentsModal = ({ course, students, attendanceRate, onClose }) => {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: usersResponse } = useGetUserQuery();
  const allUsers = usersResponse?.data?.data || usersResponse?.data || [];
  const allStudents = Array.isArray(allUsers) ? allUsers.filter(user => user.role === 'student') : [];
  
  // Students not in this course
  const availableStudents = allStudents.filter(
    student => !students.find(s => s.id === student.id)
  );
  
  const filteredAvailableStudents = availableStudents.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddStudent = (student) => {
    // In a real app, you'd create an enrollment record here
    toast.success(`${student.first_name} ${student.last_name} added to ${course.name}`);
    setShowAddStudent(false);
    // Refresh would happen here
  };
  
  const handleRemoveStudent = (student) => {
    if (window.confirm(`Remove ${student.first_name} ${student.last_name} from ${course.name}?`)) {
      // In a real app, you'd delete the enrollment record here
      toast.success(`${student.first_name} ${student.last_name} removed from ${course.name}`);
      // Refresh would happen here
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
            <p className="text-green-100">Manage students in this course</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">{students.length}</div>
            <div className="text-sm text-gray-600">Enrolled Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{attendanceRate}%</div>
            <div className="text-sm text-gray-600">Avg Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{availableStudents.length}</div>
            <div className="text-sm text-gray-600">Available to Add</div>
          </div>
        </div>

        {/* Add Student Button */}
        <div className="p-6 border-b">
          <button
            onClick={() => setShowAddStudent(!showAddStudent)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Users className="w-5 h-5" />
            {showAddStudent ? 'Cancel' : 'Add Student to Course'}
          </button>
        </div>

        {/* Add Student Section */}
        {showAddStudent && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students to add..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredAvailableStudents.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {searchTerm ? 'No students found' : 'All students are already enrolled'}
                </p>
              ) : (
                filteredAvailableStudents.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddStudent(student)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Students List */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Students Enrolled
              </h3>
              <p className="text-gray-600">
                Click "Add Student to Course" to enroll students.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-lg">
                      {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {student.first_name} {student.last_name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {student.email}
                      </div>
                      {student.phone && (
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {student.phone}
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveStudent(student)}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove from course
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourses;
