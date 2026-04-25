import React, { useState } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  useGetAttendanceQuery,
  useVerifyAttendanceMutation,
} from "../../../redux/hooks/attendaceApiSlice";
import { useGetClassroomQuery } from "../../../redux/hooks/classroomApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AttendanceManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // Fetch attendance data
  const {
    data: attendanceResponse,
    isLoading: isLoadingAttendance,
    isError: isErrorAttendance,
    refetch,
  } = useGetAttendanceQuery();

  // Fetch classroom data
  const {
    data: classroomResponse,
    isLoading: isLoadingClassroom,
    isError: isErrorClassroom,
  } = useGetClassroomQuery();

  // Extract data from API responses
  const attendanceRecords = attendanceResponse?.data || [];
  const classrooms = classroomResponse?.data || [];

  // Verify attendance mutation
  const [verifyAttendance] = useVerifyAttendanceMutation();

  // Handle verification
  const handleVerifyAttendance = async (id, status) => {
    try {
      await verifyAttendance({
        id,
        status: { status: status }, // This matches what your backend expects
      }).unwrap();
      toast.success("Update status attendance success");
      refetch(); // Refresh the data after successful verification
    } catch (error) {
      toast.error("Update status attendance not success");
      console.error("Failed to verify attendance:", error);
      // You might want to add error handling here (e.g., toast notification)
    }
  };
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter attendance records based on selected classroom and search term
  const filteredAttendance = attendanceRecords.filter((record) => {
    const matchesClassroom = selectedClassroom
      ? record.classroom_id.toString() === selectedClassroom
      : true;
    const matchesSearch = searchTerm
      ? record.user.first_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesClassroom && matchesSearch;
  });

  // Calculate attendance stats
  const presentCount = filteredAttendance.filter(
    (record) => record.status === "present",
  ).length;

  const absentCount = filteredAttendance.filter(
    (record) => record.status === "absent",
  ).length;

  const lateCount = filteredAttendance.filter(
    (record) => record.status === "late",
  ).length;

  // Navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  if (isLoadingClassroom || isLoadingAttendance) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isErrorClassroom || isErrorAttendance) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center text-red-500">
        Error loading data
      </div>
    );
  }

  const addNew = () => {
    navigate("createAttendance"); // Changed from createStudent
  };

  return (
    <div>
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Attendance Management
            </h1>
            <p className="text-gray-600">
              Track and manage attendance efficiently
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button> */}
          </div>
        </div>

        {/* Date Navigation and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Date Navigation */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Date Selection
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousDay}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={goToNextDay}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="text-2xl font-bold text-blue-900 mb-1">
                {formatDate(selectedDate)}
              </div>
              <div className="text-blue-600 text-sm">
                {selectedDate.toISOString().split("T")[0]}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-semibold text-gray-900">
                  {filteredAttendance.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Present</span>
                <span className="font-semibold text-green-600">
                  {presentCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Absent</span>
                <span className="font-semibold text-red-600">
                  {absentCount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-600">Late</span>
                <span className="font-semibold text-yellow-600">
                  {lateCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Classroom Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classroom
                </label>
                <select
                  value={selectedClassroom}
                  onChange={(e) => setSelectedClassroom(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[120px]"
                >
                  <option value="">All Classrooms</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.class_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Students
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={addNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Student Attendance List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Student Attendance
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classroom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                            {record.user.first_name.charAt(0)}
                            {record.user.last_name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.user.first_name} {record.user.last_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.classroom.class_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.attendance_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        {/* Present Button */}
                        <button
                          onClick={() =>
                            handleVerifyAttendance(record.id, "present")
                          }
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700 ring-2 ring-green-500 ring-opacity-50"
                              : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600"
                          }`}
                          title="Mark Present"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>

                        {/* Absent Button */}
                        <button
                          onClick={() =>
                            handleVerifyAttendance(record.id, "absent")
                          }
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            record.status === "absent"
                              ? "bg-red-100 text-red-700 ring-2 ring-red-500 ring-opacity-50"
                              : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          }`}
                          title="Mark Absent"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>

                        {/* Late Button */}
                        <button
                          onClick={() =>
                            handleVerifyAttendance(record.id, "late")
                          }
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            record.status === "late"
                              ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 ring-opacity-50"
                              : "bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600"
                          }`}
                          title="Mark Late"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : record.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {record.status.charAt(0).toUpperCase() +
                          record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-12">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No attendance records found
              </p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or classroom filter
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
