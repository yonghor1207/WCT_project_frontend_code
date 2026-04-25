import { useSelector } from "react-redux";
import { BookOpen, Users, Calendar, ClipboardCheck } from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-blue-600" />}
          title="My Courses"
          value="5"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Users className="w-8 h-8 text-green-600" />}
          title="Total Students"
          value="120"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Calendar className="w-8 h-8 text-purple-600" />}
          title="Classes Today"
          value="3"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<ClipboardCheck className="w-8 h-8 text-orange-600" />}
          title="Pending Attendance"
          value="2"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          <ScheduleItem
            time="09:00 AM - 10:30 AM"
            course="Mathematics 101"
            classroom="Room 201"
            students="30 students"
          />
          <ScheduleItem
            time="11:00 AM - 12:30 PM"
            course="Advanced Calculus"
            classroom="Room 305"
            students="25 students"
          />
          <ScheduleItem
            time="02:00 PM - 03:30 PM"
            course="Statistics"
            classroom="Room 201"
            students="28 students"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton title="Mark Attendance" icon={<ClipboardCheck className="w-5 h-5" />} />
          <ActionButton title="View My Courses" icon={<BookOpen className="w-5 h-5" />} />
          <ActionButton title="View Students" icon={<Users className="w-5 h-5" />} />
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

const ActionButton = ({ title, icon }) => {
  return (
    <button className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
      {icon}
      <span className="font-medium text-gray-800">{title}</span>
    </button>
  );
};

export default TeacherDashboard;
