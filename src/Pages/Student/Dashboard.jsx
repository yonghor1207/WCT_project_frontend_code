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

  // Get today's classes (mock schedule based on enrolled courses)
  const getTodayClasses = () => {
    const enrolledCourses = getEnrolledCourses();
    if (enrolledCourses.length === 0) return [];
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    // Mock schedule - in real app, this would come from schedule API
    const schedules = [
      { 
        time: "09:00 AM - 10:30 AM", 
        course: enrolledCourses[0]?.name || "Course 1",
        teacher: "Prof. John Smith",
        classroom: "Room 201"
      },
      { 
        time: "11:00 AM - 12:30 PM", 
        course: enrolledCourses[1]?.name || "Course 2",
        teacher: "Dr. Sarah Johnson",
        classroom: "Lab 105"
      },
      { 
        time: "02:00 PM - 03:30 PM", 
        course: enrolledCourses[2]?.name || "Course 3",
        teacher: "Ms. Emily Brown",
        classroom: "Room 310"
      },
    ];
    
    return schedules.slice(0, Math.min(enrolledCourses.length, 3));
  };

  const enrolledCourses = getEnrolledCourses();
  const attendanceRate = getAttendanceRate();
  const todayClasses = getTodayClasses();

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

      {/* Today's Classes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Classes</h2>
        {todayClasses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No classes scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayClasses.map((classItem, index) => (
              <ClassItem
                key={index}
                time={classItem.time}
                course={classItem.course}
                teacher={classItem.teacher}
                classroom={classItem.classroom}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
            <button
              onClick={() => navigate('/student/courses')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </button>
          </div>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No courses enrolled yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolledCourses.slice(0, 4).map((course, index) => {
                // Calculate course attendance rate
                const courseAttendance = attendanceRecords.filter(r => r.course_id === course.id);
                const coursePresent = courseAttendance.filter(r => r.status === 'present').length;
                const courseRate = courseAttendance.length > 0 
                  ? Math.round((coursePresent / courseAttendance.length) * 100)
                  : 0;
                
                return (
                  <CourseItem 
                    key={course.id} 
                    course={course.name} 
                    progress={`${courseRate}%`}
                    onClick={() => navigate('/student/courses')}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
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

const ClassItem = ({ time, course, teacher, classroom }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <div>
        <h3 className="font-semibold text-gray-800">{course}</h3>
        <p className="text-sm text-gray-600 mt-1">{time}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{teacher}</p>
        <p className="text-sm text-gray-500">{classroom}</p>
      </div>
    </div>
  );
};

const CourseItem = ({ course, progress, onClick }) => {
  return (
    <div 
      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-800">{course}</span>
        <span className="text-sm text-gray-600">{progress}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all"
          style={{ width: progress }}
        ></div>
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
