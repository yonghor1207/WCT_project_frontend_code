import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, ClipboardCheck, Calendar, DollarSign, GraduationCap } from "lucide-react";

const StudentSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/student-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/courses", icon: BookOpen, label: "My Courses" },
    { path: "/student/attendance", icon: ClipboardCheck, label: "Attendance" },
    { path: "/student/schedule", icon: Calendar, label: "Schedule" },
    { path: "/student/payments", icon: DollarSign, label: "Payments" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Student Portal</h2>
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
                  ? "bg-purple-50 text-purple-600 border-r-4 border-purple-600"
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

export default StudentSidebar;
