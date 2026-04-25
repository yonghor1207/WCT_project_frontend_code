import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, ClipboardCheck, Calendar, GraduationCap } from "lucide-react";

const TeacherSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/teacher-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/teacher/courses", icon: BookOpen, label: "My Courses" },
    { path: "/teacher/students", icon: Users, label: "Students" },
    { path: "/teacher/attendance", icon: ClipboardCheck, label: "Attendance" },
    { path: "/teacher/schedule", icon: Calendar, label: "Schedule" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Teacher Portal</h2>
        </div>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 transition ${
                isActive
                  ? "bg-green-50 text-green-600 border-r-4 border-green-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TeacherSidebar;
