import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  Search,
  Filter,
  TrendingUp,
  Download,
  CheckSquare,
  XSquare,
  BarChart3,
  Eye,
  AlertCircle,
  PieChart,
  Activity,
  FileText,
} from "lucide-react";
import { useGetAttendanceQuery, useVerifyAttendanceMutation, useCreateAttendanceMutation } from "../../redux/hooks/attendaceApiSlice";
import { useGetClassroomQuery } from "../../redux/hooks/classroomApiSlice";
import { useGetUserQuery } from "../../redux/hooks/userApiSlice";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";
import { toast } from "react-toastify";

const TeacherAttendance = () => {
  const { data: attendanceResponse, isLoading: isLoadingAttendance, refetch } = useGetAttendanceQuery();
  const { data: classroomResponse, isLoading: isLoadingClassroom } = useGetClassroomQuery();
  const { data: userResponse, isLoading: isLoadingUsers } = useGetUserQuery();
  const { data: courseResponse, isLoading: isLoadingCourses } = useGetCourseQuery();
  const [verifyAttendance] = useVerifyAttendanceMutation();
  const [createAttendance] = useCreateAttendanceMutation();

  const attendanceRecords = attendanceResponse?.data || [];
  const classrooms = classroomResponse?.data || [];
  const courses = courseResponse?.data?.data || courseResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dateRange, setDateRange] = useState("today");
  const [showReports, setShowReports] = useState(false);

  if (isLoadingAttendance || isLoadingClassroom || isLoadingUsers || isLoadingCourses) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading attendance...</div>
      </div>
    );
  }
  
  // Handle different possible data structures for users
  const allUsers = userResponse?.data?.data || userResponse?.data || [];
  const allStudents = Array.isArray(allUsers) ? allUsers.filter(user => user && user.role === 'student') : [];

  // Create a map of students with their attendance for the selected date
  const studentsWithAttendance = allStudents.map(student => {
    const attendanceRecord = attendanceRecords.find(
      record => 
        record.student_id === student.id && 
        record.attendance_date && 
        new Date(record.attendance_date).toISOString().split('T')[0] === selectedDate
    );
    
    return {
      id: attendanceRecord?.id || `temp-${student.id}`,
      student_id: student.id,
      user: student,
      classroom: attendanceRecord?.classroom || { class_name: 'Not Assigned' },
      classroom_id: attendanceRecord?.classroom_id || null,
      course: attendanceRecord?.course || { name: 'Not Assigned' },
      course_id: attendanceRecord?.course_id || null,
      attendance_date: attendanceRecord?.attendance_date || selectedDate,
      status: attendanceRecord?.status || 'not_mark',
      hasRecord: !!attendanceRecord
    };
  });

  const filteredAttendance = Array.isArray(studentsWithAttendance)
    ? studentsWithAttendance.filter((record) => {
        const matchesSearch = searchTerm
          ? record.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
        return matchesSearch;
      })
    : [];

  const presentCount = filteredAttendance.filter(r => r.status === "present").length;
  const absentCount = filteredAttendance.filter(r => r.status === "absent").length;
  const lateCount = filteredAttendance.filter(r => r.status === "late").length;
  const attendanceRate = filteredAttendance.length > 0 
    ? Math.round((presentCount / filteredAttendance.length) * 100) 
    : 0;

  const handleMarkAttendance = async (record, status) => {
    try {
      // If the student doesn't have an attendance record yet, create one first
      if (!record.hasRecord) {
        // Check if we have valid classroom and course data
        if (classrooms.length === 0) {
          toast.error("No classrooms available. Please create a classroom first.");
          return;
        }
        if (courses.length === 0) {
          toast.error("No courses available. Please create a course first.");
          return;
        }
        
        // Use first available classroom and course as defaults
        const defaultClassroom = classrooms[0].id;
        const defaultCourse = courses[0].id;
        
        const attendanceData = {
          student_id: record.student_id,
          classroom_id: record.classroom_id || defaultClassroom,
          course_id: record.course_id || defaultCourse,
          attendance_date: `${selectedDate} 08:00:00`,
          status: status
        };
        
        console.log("Creating attendance with data:", attendanceData);
        await createAttendance(attendanceData).unwrap();
        toast.success(`Marked as ${status}`);
      } else {
        // Update existing record - send just the status string, not an object
        console.log("Updating attendance:", { id: record.id, status: status });
        await verifyAttendance({
          id: record.id,
          status: status,
        }).unwrap();
        toast.success(`Marked as ${status}`);
      }
      refetch();
    } catch (error) {
      console.error("Failed to update attendance:", error);
      toast.error(`Failed to update attendance: ${error?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleBulkMarkAttendance = async (status) => {
    if (selectedStudents.length === 0) {
      toast.warning("Please select students first");
      return;
    }
    
    try {
      const promises = selectedStudents.map(id =>
        verifyAttendance({
          id,
          status: status,
        }).unwrap()
      );
      await Promise.all(promises);
      toast.success(`Marked ${selectedStudents.length} students as ${status}`);
      setSelectedStudents([]);
      refetch();
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredAttendance.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredAttendance.map(r => r.id));
    }
  };

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const getLowAttendanceStudents = () => {
    const studentAttendance = {};
    attendanceRecords.forEach(record => {
      const studentId = record.user.id;
      if (!studentAttendance[studentId]) {
        studentAttendance[studentId] = {
          name: `${record.user.first_name} ${record.user.last_name}`,
          present: 0,
          total: 0,
        };
      }
      studentAttendance[studentId].total++;
      if (record.status === "present") {
        studentAttendance[studentId].present++;
      }
    });

    return Object.values(studentAttendance)
      .map(s => ({ ...s, rate: (s.present / s.total) * 100 }))
      .filter(s => s.rate < 75)
      .sort((a, b) => a.rate - b.rate);
  };

  const lowAttendanceStudents = getLowAttendanceStudents();

  if (showReports) {
    return (
      <AttendanceReports
        attendanceRecords={attendanceRecords}
        classrooms={classrooms}
        onBack={() => setShowReports(false)}
      />
    );
  }

  if (showHistory && selectedStudent) {
    return (
      <StudentAttendanceHistory
        student={selectedStudent}
        attendanceRecords={attendanceRecords.filter(r => r.user.id === selectedStudent.id)}
        onBack={() => {
          setShowHistory(false);
          setSelectedStudent(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Attendance Management</h1>
          <p className="text-gray-600">Mark and track student attendance</p>
        </div>
      </div>

      {/* Low Attendance Alert */}
      {lowAttendanceStudents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-1">Low Attendance Alert</h3>
              <p className="text-sm text-red-700 mb-2">
                {lowAttendanceStudents.length} student(s) have attendance below 75%
              </p>
              <div className="flex flex-wrap gap-2">
                {lowAttendanceStudents.slice(0, 3).map((student, idx) => (
                  <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    {student.name} ({student.rate.toFixed(0)}%)
                  </span>
                ))}
                {lowAttendanceStudents.length > 3 && (
                  <span className="text-xs text-red-700">
                    +{lowAttendanceStudents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Total Students"
          value={filteredAttendance.length}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title="Present"
          value={presentCount}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<XCircle className="w-6 h-6 text-red-600" />}
          title="Absent"
          value={absentCount}
          bgColor="bg-red-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
          title="Late"
          value={lateCount}
          bgColor="bg-yellow-50"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Quick Date Filters */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedDate === new Date().toISOString().split('T')[0]
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              setSelectedDate(yesterday.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Yesterday
          </button>
          <button
            onClick={() => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              setSelectedDate(weekAgo.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Last Week
          </button>
          <div className="ml-auto text-sm text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-sm font-medium text-blue-900">
              {selectedStudents.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkMarkAttendance("present")}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Present
              </button>
              <button
                onClick={() => handleBulkMarkAttendance("late")}
                className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition"
              >
                <Clock className="w-4 h-4" />
                Mark Late
              </button>
              <button
                onClick={() => handleBulkMarkAttendance("absent")}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
              >
                <XCircle className="w-4 h-4" />
                Mark Absent
              </button>
              <button
                onClick={() => setSelectedStudents([])}
                className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Table */}
      {filteredAttendance.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No attendance records found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or add new attendance records
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredAttendance.length && filteredAttendance.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mark Attendance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <AttendanceRow
                    key={record.id}
                    record={record}
                    onMarkAttendance={handleMarkAttendance}
                    isSelected={selectedStudents.includes(record.id)}
                    onSelect={handleSelectStudent}
                    onViewHistory={() => {
                      setSelectedStudent(record.user);
                      setShowHistory(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const AttendanceRow = ({ record, onMarkAttendance, isSelected, onSelect, onViewHistory }) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(record.id)}
          className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
            {record.user.first_name.charAt(0)}
            {record.user.last_name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {record.user.first_name} {record.user.last_name}
            </div>
            <div className="text-sm text-gray-500">{record.user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {new Date(record.attendance_date).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onMarkAttendance(record, "present")}
            className={`p-2 rounded-lg transition ${
              record.status === "present"
                ? "bg-green-100 text-green-700 ring-2 ring-green-500"
                : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600"
            }`}
            title="Mark Present"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => onMarkAttendance(record, "late")}
            className={`p-2 rounded-lg transition ${
              record.status === "late"
                ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500"
                : "bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600"
            }`}
            title="Mark Late"
          >
            <Clock className="w-5 h-5" />
          </button>
          <button
            onClick={() => onMarkAttendance(record, "absent")}
            className={`p-2 rounded-lg transition ${
              record.status === "absent"
                ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600"
            }`}
            title="Mark Absent"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            record.status === "present"
              ? "bg-green-100 text-green-800"
              : record.status === "absent"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <button
          onClick={onViewHistory}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title="View History"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

const AttendanceReports = ({ attendanceRecords, classrooms, onBack }) => {
  const [selectedClassroom, setSelectedClassroom] = useState(classrooms.length > 0 ? classrooms[0].id.toString() : "");
  const [dateRange, setDateRange] = useState("week");

  // Filter by classroom
  const filteredRecords = selectedClassroom
    ? attendanceRecords.filter(r => r.classroom_id.toString() === selectedClassroom)
    : attendanceRecords;

  // Calculate overall stats
  const totalRecords = filteredRecords.length;
  const presentCount = filteredRecords.filter(r => r.status === "present").length;
  const lateCount = filteredRecords.filter(r => r.status === "late").length;
  const absentCount = filteredRecords.filter(r => r.status === "absent").length;
  const overallRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  // Group by date
  const dailyData = filteredRecords.reduce((acc, record) => {
    const date = new Date(record.attendance_date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { present: 0, late: 0, absent: 0, total: 0 };
    }
    acc[date][record.status]++;
    acc[date].total++;
    return acc;
  }, {});

  const dates = Object.keys(dailyData).slice(-7);

  // Group by classroom
  const classroomStats = classrooms.map(classroom => {
    const classRecords = filteredRecords.filter(r => r.classroom_id === classroom.id);
    const present = classRecords.filter(r => r.status === "present").length;
    const total = classRecords.length;
    return {
      name: classroom.class_name,
      present,
      total,
      rate: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
    };
  }).filter(c => c.total > 0);

  // Top performers
  const studentStats = {};
  filteredRecords.forEach(record => {
    const studentId = record.user.id;
    if (!studentStats[studentId]) {
      studentStats[studentId] = {
        name: `${record.user.first_name} ${record.user.last_name}`,
        email: record.user.email,
        present: 0,
        total: 0,
      };
    }
    studentStats[studentId].total++;
    if (record.status === "present") {
      studentStats[studentId].present++;
    }
  });

  const topPerformers = Object.values(studentStats)
    .map(s => ({ ...s, rate: (s.present / s.total) * 100 }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 5);

  const lowPerformers = Object.values(studentStats)
    .map(s => ({ ...s, rate: (s.present / s.total) * 100 }))
    .filter(s => s.rate < 75)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 5);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Attendance Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive attendance insights and trends</p>
          </div>
        </div>
        <select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Records</p>
              <p className="text-4xl font-bold">{totalRecords}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Present</p>
              <p className="text-4xl font-bold">{presentCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-1">Absent</p>
              <p className="text-4xl font-bold">{absentCount}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Overall Rate</p>
              <p className="text-4xl font-bold">{overallRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Daily Attendance Trend (Last 7 Days)</h2>
          <div className="flex items-end justify-between gap-2 h-64">
            {dates.map((date) => {
              const data = dailyData[date];
              const maxHeight = Math.max(...dates.map(d => dailyData[d].total));
              const height = (data.total / maxHeight) * 100;

              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col-reverse gap-1 h-48">
                    <div
                      className="bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                      style={{ height: `${(data.present / data.total) * height}%` }}
                      title={`Present: ${data.present}`}
                    />
                    <div
                      className="bg-gradient-to-t from-yellow-500 to-yellow-400"
                      style={{ height: `${(data.late / data.total) * height}%` }}
                      title={`Late: ${data.late}`}
                    />
                    <div
                      className="bg-gradient-to-t from-red-500 to-red-400"
                      style={{ height: `${(data.absent / data.total) * height}%` }}
                      title={`Absent: ${data.absent}`}
                    />
                  </div>
                  <span className="text-xs text-gray-600 text-center transform -rotate-45 origin-top-left mt-4">
                    {date.split('/')[0]}/{date.split('/')[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classroom Performance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Classroom Performance</h2>
          <div className="space-y-4">
            {classroomStats.map((classroom, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{classroom.name}</span>
                  <span className="text-sm font-bold text-gray-900">{classroom.rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      classroom.rate >= 90 ? 'bg-green-500' :
                      classroom.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${classroom.rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{classroom.present} present</span>
                  <span>{classroom.total} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top & Low Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-50 p-4 border-b border-green-100">
            <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performers
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPerformers.map((student, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{student.rate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">{student.present}/{student.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Performers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-50 p-4 border-b border-red-100">
            <h2 className="text-xl font-bold text-red-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Needs Attention
            </h2>
          </div>
          <div className="p-6">
            {lowPerformers.length > 0 ? (
              <div className="space-y-4">
                {lowPerformers.map((student, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">
                      !
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">{student.rate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">{student.present}/{student.total}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>All students have good attendance!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentAttendanceHistory = ({ student, attendanceRecords, onBack }) => {
  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === "present").length;
  const lateCount = attendanceRecords.filter(r => r.status === "late").length;
  const absentCount = attendanceRecords.filter(r => r.status === "absent").length;
  const attendanceRate = totalRecords > 0 ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

  // Group by month
  const monthlyData = attendanceRecords.reduce((acc, record) => {
    const month = new Date(record.attendance_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { present: 0, late: 0, absent: 0 };
    }
    acc[month][record.status]++;
    return acc;
  }, {});

  const months = Object.keys(monthlyData).slice(-6);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-medium">
            {student.first_name.charAt(0)}{student.last_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {student.first_name} {student.last_name}
            </h1>
            <p className="text-gray-600">{student.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-800">{totalRecords}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Present</p>
              <p className="text-3xl font-bold text-gray-800">{presentCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Absent</p>
              <p className="text-3xl font-bold text-gray-800">{absentCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Attendance Rate</p>
              <p className="text-3xl font-bold text-gray-800">{attendanceRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Monthly Attendance Trend</h2>
        <div className="flex items-end justify-between gap-4 h-64">
          {months.map((month) => {
            const data = monthlyData[month];
            const total = data.present + data.late + data.absent;
            const presentHeight = (data.present / total) * 100;
            const lateHeight = (data.late / total) * 100;
            const absentHeight = (data.absent / total) * 100;

            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col-reverse gap-1 h-48">
                  {data.present > 0 && (
                    <div
                      className="bg-green-500 rounded-t"
                      style={{ height: `${presentHeight}%` }}
                      title={`Present: ${data.present}`}
                    />
                  )}
                  {data.late > 0 && (
                    <div
                      className="bg-yellow-500"
                      style={{ height: `${lateHeight}%` }}
                      title={`Late: ${data.late}`}
                    />
                  )}
                  {data.absent > 0 && (
                    <div
                      className="bg-red-500"
                      style={{ height: `${absentHeight}%` }}
                      title={`Absent: ${data.absent}`}
                    />
                  )}
                </div>
                <span className="text-xs text-gray-600 text-center">{month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-gray-600">Late</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classroom</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.attendance_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.classroom.class_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === "present"
                          ? "bg-green-100 text-green-800"
                          : record.status === "absent"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;
