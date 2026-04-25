import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { logoutSuccess } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const TeacherHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="h-16 bg-white shadow-sm">
      <div className="flex justify-between items-center h-full px-6">
        <h1 className="font-bold text-lg text-gray-600">
          Hello! <span className="text-green-600">{user?.first_name} {user?.last_name}</span>, Welcome to Teacher Portal!
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">View Landing</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-medium">
            {user?.first_name?.charAt(0)}
            {user?.last_name?.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHeader;
