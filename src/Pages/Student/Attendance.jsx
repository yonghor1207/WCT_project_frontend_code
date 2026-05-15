import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  AlertCircle,
  Award,
  Target,
} from "lucide-react";
import { useGetAttendanceQuery } from "../../redux/hooks/attendaceApiSlice";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";

const StudentAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("");

  const { data: attendanceResponse, isLoading: isLoadingAttendance } = useGetAttendanceQuery();
  const { data: courseResponse } = useGetCourseQuery();

  if (isLoadingAttendance) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading attendance...</div>
      </div>
    );
  }

  const attendanceRecords = attendanceResponse?.data || [];
  const courses = courseResponse?.data || [];

  // Ensure courses is an array
  const coursesList = Array.isArray(courses) ? courses : [];

  // Get current logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id;
  const currentUserEmail = currentUser?.email;

  console.log('Current User:', currentUser);
  console.log('Current User ID:', currentUserId);
  console.log('All Attendance Records:', attendanceRecords);

  // Filter records for ONLY the current logged-in student
  const myAttendance = Array.isArray(attendanceRecords) 
    ? attendanceRecords.filter(record => {
        // Filter by student_id OR by user email if student_id matches
        const matchesId = record.student_id === currentUserId;
        const matchesEmail = record.user?.email === currentUserEmail;
        return matchesId || matchesEmail;
      })
    : [];

  console.log('My Attendance (filtered):', myAttendance);

  const filteredAttendance = selectedCourse
    ? myAttendance.filter(r => r.course_id.toString() === selectedCourse)
    : myAttendance;

  // Calculate statistics
  const totalClasses = filteredAttendance.length;
  const presentCount = filteredAttendance.filter(r => r.status === "present").length;
  const lateCount = filteredAttendance.filter(r => r.status === "late").length;
  const absentCount = filteredAttendance.filter(r => r.status === "absent").length;
  const attendanceRate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  // Show empty state if no attendance records
  if (totalClasses === 0) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Attendance</h1>
          <p className="text-gray-600">Track your class attendance and performance</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            No Attendance Records Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Your attendance records will appear here once your teachers start marking attendance.
          </p>
        </div>
      </div>
    );
  }

  // Get attendance by course
  const attendanceByCourse = coursesList.map(course => {
    const courseRecords = myAttendance.filter(r => r.course_id === course.id);
    const coursePresent = courseRecords.filter(r => r.status === "present").length;
    const courseTotal = courseRecords.length;
    return {
      name: course.name,
      present: coursePresent,
      total: courseTotal,
      rate: courseTotal > 0 ? ((coursePresent / courseTotal) * 100).toFixed(1) : 0,
    };
  }).filter(c => c.total > 0);

  // Get attendance status
  const getAttendanceStatus = () => {
    if (attendanceRate >= 90) return { text: "Excellent", color: "green", icon: Award };
    if (attendanceRate >= 75) return { text: "Good", color: "blue", icon: Target };
    if (attendanceRate >= 60) return { text: "Fair", color: "yellow", icon: AlertCircle };
    return { text: "Needs Improvement", color: "red", icon: AlertCircle };
  };

  const status = getAttendanceStatus();
  const StatusIcon = status.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Attendance</h1>
          <p className="text-gray-600">Track your class attendance and performance</p>
        </div>
      </div>

      {/* Attendance Status Alert */}
      <div className={`${
        status.color === 'green' ? 'bg-green-50 border-green-200' :
        status.color === 'blue' ? 'bg-blue-50 border-blue-200' :
        status.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      } border rounded-lg p-4 mb-6`}>
        <div className="flex items-start gap-3">
          <StatusIcon className={`w-6 h-6 ${
            status.color === 'green' ? 'text-green-600' :
            status.color === 'blue' ? 'text-blue-600' :
            status.color === 'yellow' ? 'text-yellow-600' :
            'text-red-600'
          } mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${
              status.color === 'green' ? 'text-green-900' :
              status.color === 'blue' ? 'text-blue-900' :
              status.color === 'yellow' ? 'text-yellow-900' :
              'text-red-900'
            } mb-1`}>
              Attendance Status: {status.text}
            </h3>
            <p className="text-sm text-gray-700">
              Your current attendance rate is {attendanceRate}%. 
              {attendanceRate < 75 && " You need to improve your attendance to meet the minimum requirement of 75%."}
              {attendanceRate >= 75 && attendanceRate < 90 && " Keep up the good work!"}
              {attendanceRate >= 90 && " Excellent attendance record!"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Present</p>
              <p className="text-4xl font-bold">{presentCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Absent</p>
              <p className="text-4xl font-bold">{absentCount}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Attendance Rate</p>
              <p className="text-4xl font-bold">{attendanceRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Detailed Records */}
      <DetailsView 
        filteredAttendance={filteredAttendance}
        courses={coursesList}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />
    </div>
  );
};

const OverviewView = ({ attendanceByCourse }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Course-wise Attendance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Attendance by Course</h2>
        {attendanceByCourse.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No course attendance data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendanceByCourse.map((course, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{course.name}</span>
                  <span className="text-sm font-bold text-gray-900">{course.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      course.rate >= 90 ? 'bg-green-500' :
                      course.rate >= 75 ? 'bg-blue-500' :
                      course.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${course.rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{course.present} present</span>
                  <span>{course.total} total</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailsView = ({ filteredAttendance, courses, selectedCourse, setSelectedCourse }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="flex-nowrap">
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classroom</th>
              <th className="w-1/4 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(record.attendance_date).toLocaleDateString()}
                </td>
                <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.course.name}
                </td>
                <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.classroom.class_name}
                </td>
                <td className="w-1/4 px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      record.status === "present"
                        ? "bg-green-100 text-green-800"
                        : record.status === "absent"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;
