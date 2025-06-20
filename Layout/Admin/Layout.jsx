import { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  ClipboardCheck,
  CreditCard,
  Calendar,
  School,
  LogOut,
  Book,
} from "lucide-react";
import { useLogoutMutation } from "../../src/redux/hooks/authApiSlice";
import { logoutSuccess } from "../../src/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logoutSuccess());
      toast("Logout Success!", { position: "top-right" });
      navigate("/login"); // redirect to login
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("Logout failed", { position: "top-right" });
    }
  };

  // Set active item based on current path
  const [activeItem, setActiveItem] = useState(() => {
    const path = currentPath.split("/").pop() || "dashboard";
    return path;
  });

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/",
    },
    {
      id: "teacher",
      label: "Teacher",
      icon: <Users size={20} />,
      path: "/teacher",
    },
    {
      id: "student",
      label: "Student",
      icon: <UserCircle size={20} />,
      path: "/student",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <ClipboardCheck size={20} />,
      path: "/attendance",
    },
    {
      id: "payment",
      label: "Payment",
      icon: <CreditCard size={20} />,
      path: "/payment",
    },
    // {
    //   id: "schedule",
    //   label: "Schedule",
    //   icon: <Calendar size={20} />,
    //   path: "/schedule",
    // },
    {
      id: "classroom",
      label: "Classroom",
      icon: <School size={20} />,
      path: "/classroom",
    },
    {
      id: "course",
      label: "Courses",
      icon: <Book size={20} />,
      path: "/course",
    },
  ];

  const handleItemClick = (id, path) => {
    setActiveItem(id);
    navigate(path);
  };

  return (
    <div className="h-screen w-72 bg-gray-900 text-white flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center gap-3 p-4 mb-6">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <h1 className="font-medium">School Management System</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-700 transition-colors ${activeItem.toLowerCase() === item.id.toLowerCase()
                  ? "bg-gray-600"
                  : ""
                  }`}
                onClick={() => handleItemClick(item.id, item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-18">
        <button onClick={handleLogout} className="border border-red-500 text-white px-4 py-2 rounded flex items-center justify-center w-full gap-2 hover:bg-red-700 transition-colors">
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
};
export default Layout;
