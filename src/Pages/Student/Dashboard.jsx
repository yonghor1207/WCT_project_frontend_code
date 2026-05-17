import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, ClipboardCheck, DollarSign } from "lucide-react";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";
import { useGetAttendanceQuery } from "../../redux/hooks/attendaceApiSlice";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Fetch data from APIs
  const { data: coursesResponse } = useGetCourseQuery();
  const { data: attendanceResponse } = useGetAttendanceQuery();

  const allCourses = coursesResponse?.data?.data || coursesResponse?.data || [];
  const attendanceRecords = attendanceResponse?.data || [];

  // Get student's enrolled courses from attendance records
  const getEnrolledCourses = () => {
    if (!Array.isArray(attendanceRecords) || !Array.isArray(allCourses)) return [];
    
    // Get unique course IDs from student's attendance
    const courseIds = [...new Set(attendanceRecords.map(record => record.course_id))];
    return allCourses.filter(course => courseIds.includes(course.id));
  };

  // Calculate attendance rate
  const getAttendanceRate = () => {
    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) return 0;
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    return Math.round((presentCount / attendanceRecords.length) * 100);
  };

  const enrolledCourses = getEnrolledCourses();
  const attendanceRate = getAttendanceRate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Track your progress and stay on top of your studies.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-blue-600" />}
          title="Enrolled Courses"
          value={enrolledCourses.length}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<ClipboardCheck className="w-8 h-8 text-green-600" />}
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          bgColor="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ActionButton 
              title="View My Courses" 
              icon={<BookOpen className="w-5 h-5" />}
              onClick={() => navigate('/student/courses')}
            />
            <ActionButton 
              title="Check Attendance" 
              icon={<ClipboardCheck className="w-5 h-5" />}
              onClick={() => navigate('/student/attendance')}
            />
            <ActionButton 
              title="View Schedule" 
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => navigate('/student/schedule')}
            />
            <ActionButton 
              title="Payment History" 
              icon={<DollarSign className="w-5 h-5" />}
              onClick={() => navigate('/student/payments')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const ActionButton = ({ title, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
    >
      {icon}
      <span className="font-medium text-gray-800">{title}</span>
    </button>
  );
};

export default StudentDashboard;
