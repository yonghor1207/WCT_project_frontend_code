import { useSelector } from "react-redux";
import { BookOpen, Calendar, ClipboardCheck, DollarSign, Award } from "lucide-react";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-gray-600 mt-2">Track your progress and stay on top of your studies.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<BookOpen className="w-8 h-8 text-blue-600" />}
          title="Enrolled Courses"
          value="6"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<ClipboardCheck className="w-8 h-8 text-green-600" />}
          title="Attendance Rate"
          value="92%"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<Award className="w-8 h-8 text-purple-600" />}
          title="Average Grade"
          value="A-"
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<DollarSign className="w-8 h-8 text-orange-600" />}
          title="Payment Status"
          value="Paid"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Classes</h2>
        <div className="space-y-4">
          <ClassItem
            time="09:00 AM - 10:30 AM"
            course="Mathematics 101"
            teacher="Prof. John Smith"
            classroom="Room 201"
          />
          <ClassItem
            time="11:00 AM - 12:30 PM"
            course="Physics"
            teacher="Dr. Sarah Johnson"
            classroom="Lab 105"
          />
          <ClassItem
            time="02:00 PM - 03:30 PM"
            course="English Literature"
            teacher="Ms. Emily Brown"
            classroom="Room 310"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Courses</h2>
          <div className="space-y-3">
            <CourseItem course="Mathematics 101" progress="85%" />
            <CourseItem course="Physics" progress="78%" />
            <CourseItem course="English Literature" progress="92%" />
            <CourseItem course="Chemistry" progress="88%" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <ActionButton title="View My Courses" icon={<BookOpen className="w-5 h-5" />} />
            <ActionButton title="Check Attendance" icon={<ClipboardCheck className="w-5 h-5" />} />
            <ActionButton title="View Schedule" icon={<Calendar className="w-5 h-5" />} />
            <ActionButton title="Payment History" icon={<DollarSign className="w-5 h-5" />} />
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

const CourseItem = ({ course, progress }) => {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-800">{course}</span>
        <span className="text-sm text-gray-600">{progress}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full"
          style={{ width: progress }}
        ></div>
      </div>
    </div>
  );
};

const ActionButton = ({ title, icon }) => {
  return (
    <button className="w-full flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
      {icon}
      <span className="font-medium text-gray-800">{title}</span>
    </button>
  );
};

export default StudentDashboard;
