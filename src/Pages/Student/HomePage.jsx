import React from "react";
import {
  Book,
  Calendar,
  Clock,
  FileText,
  Award,
  User,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const HomePage = () => {
  // Mock student data
  const student = {
    name: "Alex Johnson",
    id: "STU2025389",
    grade: "11th Grade",
    gpa: "3.8",
  };

  // Mock course data
  const courses = [
    {
      id: 1,
      name: "Advanced Mathematics",
      progress: 68,
      upcoming: "Quiz on Calculus - May 20",
    },
    {
      id: 2,
      name: "Physics",
      progress: 75,
      upcoming: "Lab Report due - May 22",
    },
    {
      id: 3,
      name: "Literature",
      progress: 92,
      upcoming: "Essay Review - May 19",
    },
    {
      id: 4,
      name: "Computer Science",
      progress: 85,
      upcoming: "Programming Project - May 25",
    },
  ];

  // Mock upcoming events
  const events = [
    { date: "May 19", title: "Literature Essay Review", time: "10:00 AM" },
    { date: "May 20", title: "Math Quiz", time: "9:30 AM" },
    { date: "May 22", title: "Physics Lab Report Due", time: "11:59 PM" },
    { date: "May 24", title: "School Assembly", time: "2:00 PM" },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* Main content area */}
      <div className="flex-grow p-4">
        <div className="flex h-full">
          {/* Main content section */}
          <div className="flex-grow pr-4">
            <div className="bg-gray-200 p-4 rounded-lg h-full">
              {/* Content area with white background */}
              <div className="bg-white rounded-md h-full w-full p-4 overflow-y-auto">
                {/* Welcome message and stats */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">
                    Welcome back, {student.name}!
                  </h1>
                  <p className="text-gray-600">
                    Here's what's happening with your courses today
                  </p>
                </div>

                {/* Course progress cards */}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Book className="mr-2 text-blue-600" size={18} />
                  Your Courses
                </h2>
                <NavLink to="/students/mycourses">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-gray-800">
                          {course.name}
                        </h3>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Progress
                            </span>
                            <span className="text-xs font-medium">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 flex items-center">
                          <Clock size={14} className="mr-1 text-amber-500" />
                          {course.upcoming}
                        </p>
                      </div>
                    ))}
                  </div>
                </NavLink>

                {/* Calendar section */}
                <h2 className="text-lg font-semibold mb-3 flex items-center">
                  <Calendar className="mr-2 text-blue-600" size={18} />
                  Upcoming Events
                </h2>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* User profile sidebar */}
          <div className="w-64 bg-gray-200 rounded-lg p-4 flex flex-col">
            {/* Profile section */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 border-2 border-blue-500">
                <User size={32} className="text-blue-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.id}</p>
                <div className="mt-2 px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700 font-medium">
                  {student.grade}
                </div>
              </div>
            </div>

            {/* Academic info */}
            <div className="border-t border-gray-300 pt-4 mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Academic Info
              </h4>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">GPA</span>
                <span className="text-sm font-medium">{student.gpa}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Attendance</span>
                <span className="text-sm font-medium">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-sm font-medium">18/24 Credits</span>
              </div>
            </div>

            {/* Quick links */}
            <div className="border-t border-gray-300 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                  >
                    <FileText size={14} className="mr-2" />
                    Assignments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Award size={14} className="mr-2" />
                    Grades & Reports
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Calendar size={14} className="mr-2" />
                    Schedule
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600"
                  >
                    <Settings size={14} className="mr-2" />
                    Account Settings
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
