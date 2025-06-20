import React from "react";
import { Search, Bell, MessageSquare, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full bg-gray-200 p-2 flex items-center justify-between">
      {/* Left section with logo and navigation */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.168 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <span className="font-bold text-blue-600 text-lg ml-2">
            EduPortal
          </span>
        </div>
        {/* <div className="flex space-x-2">
          <NavLink to="/students/mycourses">
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Courses
            </button>
          </NavLink>

          <button className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Grades
          </button>
        </div> */}
      </div>

      {/* Search bar */}
      <div className="flex-grow max-w-md mx-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses, assignments..."
            className="w-full px-4 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Right section with controls */}
      <div className="flex items-center space-x-3">
        <button className="text-gray-700 hover:text-blue-600">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-gray-700 hover:text-blue-600">
          <MessageSquare className="w-5 h-5" />
        </button>
        <button className="text-gray-700 hover:text-blue-600">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;
