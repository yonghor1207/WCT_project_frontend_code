import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  console.log("user:", user);

  return (
    <div className="h-16 bg-gray-300">
      <div className="flex justify-between items-center h-full px-6">
        <h1 className="font-bold text-lg text-gray-600">
          Hello! <span className="text-blue-500">{user.first_name + " " + user.last_name}</span>,  Welcome back to School System!
        </h1>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">View Landing</span>
          </Link>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
            {user.first_name.charAt(0)}
            {user.last_name.charAt(0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
