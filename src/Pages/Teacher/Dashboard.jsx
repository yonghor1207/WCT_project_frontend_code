import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Calendar, ClipboardCheck } from "lucide-react";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";
import { useGetUserQuery } from "../../redux/hooks/userApiSlice";
import { useGetAttendanceQuery } from "../../redux/hooks/attendaceApiSlice";

const TeacherDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // Fetch data from APIs
  const { data: coursesResponse } = useGetCourseQuery();
  const { data: usersResponse } = useGetUserQuery();
  const { data: attendanceResponse } = useGetAttendanceQuery();

  const courses = coursesResponse?.data?.data || coursesResponse?.data || [];
  const allUsers = usersResponse?.data?.data || usersResponse?.data || [];
  const attendanceRecords = attendanceResponse?.data || [];

  // Get students (users with role 'student')
  const students = Array.isArray(allUsers) ? allUsers.filter(user => user.role === 'student') : [];

  const totalCourses = Array.isArray(courses) ? courses.length : 0;
  const totalStudents = students.length;
  const classesToday = 0;

  // Today's schedule - empty until schedule API is available
  const todaySchedule = [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-blue-600" />}
          title="My Courses"
          value={totalCourses}
          bgColor="bg-blue-50"
          onClick={() => navigate('/teacher/courses')}
          clickable
        />
        <StatCard
          icon={<Users className="w-8 h-8 text-green-600" />}
          title="Total Students"
          value={totalStudents}
          bgColor="bg-green-50"
          onClick={() => navigate('/teacher/students')}
          clickable
        />
        <StatCard
          icon={<Calendar className="w-8 h-8 text-purple-600" />}
          title="Classes Today"
          value={classesToday}
          bgColor="bg-purple-50"
          onClick={() => navigate('/teacher/schedule')}
          clickable
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton 
            title="Mark Attendance" 
            icon={<ClipboardCheck className="w-5 h-5" />} 
            onClick={() => navigate('/teacher/attendance')}
          />
          <ActionButton 
            title="View My Courses" 
            icon={<BookOpen className="w-5 h-5" />} 
            onClick={() => navigate('/teacher/courses')}
          />
          <ActionButton 
            title="View Students" 
            icon={<Users className="w-5 h-5" />} 
            onClick={() => navigate('/teacher/students')}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor, onClick, clickable }) => {
  const cardClasses = `${bgColor} rounded-lg p-6 ${clickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`;
  
  return (
    <div className={cardClasses} onClick={clickable ? onClick : undefined}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
      {clickable && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          Click to view details →
        </div>
      )}
    </div>
  );
};

const ScheduleItem = ({ time, course, classroom, students }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div>
        <h3 className="font-semibold text-gray-800">{course}</h3>
        <p className="text-sm text-gray-600 mt-1">{time}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{classroom}</p>
        <p className="text-sm text-gray-500">{students}</p>
      </div>
    </div>
  );
};

const ActionButton = ({ title, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
    >
      {icon}
      <span className="font-medium text-gray-800">{title}</span>
    </button>
  );
};

export default TeacherDashboard;
