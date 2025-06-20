import React from "react";
import { useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Play,
  Download,
  FileText,
  Video,
  User,
  ArrowLeft,
  UserCheck,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  AlertTriangle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const MyCourse = () => {
  // Mock course data
  const [expandedModules, setExpandedModules] = useState([0]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const toggleModule = (index) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const markAttendance = () => {
    setShowAttendanceModal(true);
  };

  const course = {
    title: "Introduction to Biology",
    description:
      "Learn the fundamentals of biology including cell structure, genetics, evolution, and ecosystems.",
    instructor: "Dr. Sarah Johnson",
    duration: "8 weeks",
    enrolledDate: "March 15, 2025",
    progress: 35,
    attendance: {
      total: 24,
      present: 18,
      absent: 2,
      late: 4,
      percentage: 75,
    },
    lastAttendance: "May 18, 2025",
    modules: [
      {
        title: "Getting Started with Biology",
        completed: true,
        lessons: [
          {
            title: "Course Overview",
            type: "video",
            duration: "5 min",
            completed: true,
          },
          {
            title: "What is Biology?",
            type: "reading",
            duration: "10 min",
            completed: true,
          },
          {
            title: "Scientific Method",
            type: "video",
            duration: "15 min",
            completed: true,
          },
          {
            title: "Week 1 Quiz",
            type: "quiz",
            duration: "20 min",
            completed: true,
          },
        ],
      },
      {
        title: "Cell Structure and Function",
        completed: false,
        attendance: {
          required: 8,
          present: 4,
          absent: 1,
          late: 1,
          upcoming: 2,
        },
        lessons: [
          {
            title: "Introduction to Cells",
            type: "video",
            duration: "12 min",
            completed: true,
          },
          {
            title: "Cell Organelles",
            type: "reading",
            duration: "15 min",
            completed: true,
          },
          {
            title: "Cell Transport",
            type: "video",
            duration: "18 min",
            completed: false,
          },
          {
            title: "Cell Laboratory",
            type: "activity",
            duration: "30 min",
            completed: false,
          },
          {
            title: "Week 2 Quiz",
            type: "quiz",
            duration: "25 min",
            completed: false,
          },
        ],
      },
      {
        title: "Genetics and DNA",
        completed: false,
        lessons: [
          {
            title: "DNA Structure",
            type: "video",
            duration: "20 min",
            completed: false,
          },
          {
            title: "Genes and Chromosomes",
            type: "reading",
            duration: "25 min",
            completed: false,
          },
          {
            title: "Inheritance Patterns",
            type: "video",
            duration: "22 min",
            completed: false,
          },
          {
            title: "Genetic Disorders",
            type: "reading",
            duration: "15 min",
            completed: false,
          },
          {
            title: "Week 3 Quiz",
            type: "quiz",
            duration: "25 min",
            completed: false,
          },
        ],
      },
      {
        title: "Evolution and Natural Selection",
        completed: false,
        lessons: [
          {
            title: "Darwin's Theory",
            type: "video",
            duration: "18 min",
            completed: false,
          },
          {
            title: "Evidence for Evolution",
            type: "reading",
            duration: "20 min",
            completed: false,
          },
          {
            title: "Natural Selection in Action",
            type: "video",
            duration: "15 min",
            completed: false,
          },
          {
            title: "Week 4 Quiz",
            type: "quiz",
            duration: "30 min",
            completed: false,
          },
        ],
      },
    ],
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <FileText className="w-4 h-4" />;
      case "activity":
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <NavLink to="/students/homepage">
              <button className="p-2 rounded-full hover:bg-blue-700">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </NavLink>
            <h1 className="text-xl font-bold">School Management System</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="bg-blue-100 p-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              {course.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-blue-800">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Enrolled: {course.enrolledDate}</span>
              </div>
            </div>
          </div>

          {/* Course Progress */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Your Progress</h2>
              <div className="flex space-x-4">
                <span className="text-blue-700">
                  {course.progress}% Complete
                </span>
                <button
                  onClick={markAttendance}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center text-sm"
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Mark Attendance
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-blue-800">
                  Attendance Record
                </h3>
                <span className="text-sm text-blue-800">
                  Last checked in: {course.lastAttendance}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white px-3 py-2 rounded shadow-sm">
                  <span className="text-xs text-gray-500">Attendance Rate</span>
                  <div className="text-lg font-semibold">
                    {course.attendance.percentage}%
                  </div>
                </div>
                <div className="bg-white px-3 py-2 rounded shadow-sm">
                  <span className="text-xs text-gray-500">Present</span>
                  <div className="text-lg font-semibold text-green-600">
                    {course.attendance.present}
                  </div>
                </div>
                <div className="bg-white px-3 py-2 rounded shadow-sm">
                  <span className="text-xs text-gray-500">Late</span>
                  <div className="text-lg font-semibold text-yellow-600">
                    {course.attendance.late}
                  </div>
                </div>
                <div className="bg-white px-3 py-2 rounded shadow-sm">
                  <span className="text-xs text-gray-500">Absent</span>
                  <div className="text-lg font-semibold text-red-600">
                    {course.attendance.absent}
                  </div>
                </div>
                <div className="flex items-center ml-auto">
                  <a
                    href="/attendance"
                    className="text-blue-700 text-sm font-medium hover:underline"
                  >
                    View Full Attendance →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="p-6 border-b">
            <h2 className="font-semibold mb-2">About this Course</h2>
            <p className="text-gray-700">{course.description}</p>
          </div>

          {/* Course Content */}
          <div className="p-6">
            <h2 className="font-semibold mb-4">Course Content</h2>
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="border rounded-lg overflow-hidden"
                >
                  <div
                    className={`flex justify-between items-center p-4 cursor-pointer ${
                      expandedModules.includes(moduleIndex)
                        ? "bg-blue-50"
                        : "bg-white"
                    }`}
                    onClick={() => toggleModule(moduleIndex)}
                  >
                    <div className="flex items-center space-x-3">
                      {module.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <h3 className="font-medium">{module.title}</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">
                        {module.lessons.length} lessons
                      </span>
                      {expandedModules.includes(moduleIndex) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {expandedModules.includes(moduleIndex) && (
                    <div className="border-t">
                      {/* Module Attendance Info */}
                      {module.attendance && (
                        <div className="p-3 bg-gray-50 border-b">
                          <div className="flex flex-wrap justify-between items-center">
                            <div className="text-sm font-medium mb-1">
                              Session Attendance
                            </div>
                            <div className="flex space-x-3 text-sm">
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                {module.attendance.present}/
                                {module.attendance.required}
                              </span>
                              <span className="flex items-center text-yellow-600">
                                <Clock className="w-3 h-3 mr-1" />{" "}
                                {module.attendance.late}
                              </span>
                              <span className="flex items-center text-red-600">
                                <AlertTriangle className="w-3 h-3 mr-1" />{" "}
                                {module.attendance.absent}
                              </span>
                            </div>
                          </div>
                          {module.attendance.upcoming > 0 && (
                            <div className="mt-2 text-xs text-blue-700">
                              {module.attendance.upcoming} upcoming sessions
                              this week
                            </div>
                          )}
                        </div>
                      )}

                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className={`flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0 ${
                            lesson.completed ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                            )}
                            <div className="flex items-center">
                              <span className="mr-2">
                                {getLessonIcon(lesson.type)}
                              </span>
                              <span className="font-medium">
                                {lesson.title}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                              {lesson.duration}
                            </span>
                            <button className="p-1 rounded-full bg-blue-100 hover:bg-blue-200">
                              {lesson.type === "video" ? (
                                <Play className="w-4 h-4 text-blue-700" />
                              ) : (
                                <FileText className="w-4 h-4 text-blue-700" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Course Resources */}
          <div className="p-6 border-t">
            <h2 className="font-semibold mb-4">Course Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-700 mr-3" />
                  <span>Course Syllabus</span>
                </div>
                <button className="text-blue-700 hover:text-blue-900">
                  <Download className="w-5 h-5" />
                </button>
              </div>
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-700 mr-3" />
                  <span>Biology Glossary</span>
                </div>
                <button className="text-blue-700 hover:text-blue-900">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Mark Attendance</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700">
                  You are about to mark your attendance for:
                </p>
                <p className="font-semibold text-blue-800">{course.title}</p>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>{new Date().toLocaleDateString()}</span>
                  <ClockIcon className="w-4 h-4 ml-4 mr-1" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-md mb-4">
                <p className="text-sm">
                  Your attendance will be recorded based on your current
                  location and time. Make sure you're physically present in the
                  class or designated study area.
                </p>
              </div>

              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="confirmAttendance"
                  className="mr-2"
                />
                <label
                  htmlFor="confirmAttendance"
                  className="text-sm text-gray-700"
                >
                  I confirm that I am present for this course session
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAttendanceModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Confirm Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourse;
