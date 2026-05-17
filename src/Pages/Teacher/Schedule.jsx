import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Plus,
  Grid3x3,
  List,
  AlertCircle,
  X,
  Trash2,
} from "lucide-react";
import { useGetClassroomQuery } from "../../redux/hooks/classroomApiSlice";
import { useGetCourseQuery } from "../../redux/hooks/courseApiSlice";
import { useGetUserQuery } from "../../redux/hooks/userApiSlice";
import { toast } from "react-toastify";

const TeacherSchedule = () => {
  const [viewMode, setViewMode] = useState("week"); // week, month, day
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: classroomResponse } = useGetClassroomQuery();
  const { data: courseResponse } = useGetCourseQuery();
  const { data: userResponse } = useGetUserQuery();

  const classrooms = classroomResponse?.data || [];
  const courses = courseResponse?.data?.data || courseResponse?.data || [];
  const teachers = userResponse?.data?.data?.filter(user => user.role === 'teacher') || [];

  // Load schedule from localStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('teacherSchedule');
    if (savedSchedule) {
      try {
        setScheduleData(JSON.parse(savedSchedule));
      } catch (error) {
        console.error('Failed to parse saved schedule:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    if (scheduleData.length > 0) {
      localStorage.setItem('teacherSchedule', JSON.stringify(scheduleData));
    }
  }, [scheduleData]);

  const handleAddClass = (newClass) => {
    const classToAdd = {
      ...newClass,
      id: Date.now(), // Use timestamp as unique ID
    };
    setScheduleData([...scheduleData, classToAdd]);
    setShowAddModal(false);
    toast.success("Class added successfully!");
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      setScheduleData(scheduleData.filter(c => c.id !== classId));
      toast.success("Class deleted successfully!");
    }
  };

  const filteredSchedule = selectedClassroom
    ? scheduleData.filter(s => s.classroom_id?.toString() === selectedClassroom)
    : scheduleData;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const getClassesForDay = (day) => {
    return filteredSchedule.filter(s => s.day === day);
  };

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    console.log('Today is:', today);
    console.log('Filtered schedule:', filteredSchedule);
    console.log('Today classes:', filteredSchedule.filter(s => s.day === today));
    return filteredSchedule.filter(s => s.day === today);
  };

  const getUpcomingClass = () => {
    const todayClasses = getTodayClasses();
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return todayClasses.find(c => c.startTime > currentTime) || todayClasses[0];
  };

  const exportSchedule = () => {
    const headers = ["Day", "Course", "Classroom", "Start Time", "End Time"];
    const rows = filteredSchedule.map(s => [
      s.day,
      s.course,
      s.classroom,
      s.startTime,
      s.endTime,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.csv";
    a.click();
    toast.success("Schedule exported successfully");
  };

  const upcomingClass = getUpcomingClass();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Schedule</h1>
          <p className="text-gray-600">Manage your teaching schedule and classes</p>
        </div>
        <div className="flex gap-3">
          {scheduleData.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all classes from your schedule?")) {
                  setScheduleData([]);
                  localStorage.removeItem('teacherSchedule');
                  toast.success("Schedule cleared successfully!");
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>
      </div>

      {/* Upcoming Class Alert */}
      {upcomingClass && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-1">Next Class</h3>
              <p className="text-sm text-gray-700 mb-2">
                {upcomingClass.title} at {upcomingClass.startTime} in {upcomingClass.classroom}
              </p>
              <div className="flex gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {upcomingClass.startTime} - {upcomingClass.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {upcomingClass.classroom}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-800">{filteredSchedule.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Today's Classes</p>
              <p className="text-3xl font-bold text-gray-800">{getTodayClasses().length}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Classrooms</p>
              <p className="text-3xl font-bold text-gray-800">
                {new Set(filteredSchedule.map(s => s.classroom_id)).size}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Teaching Hours</p>
              <p className="text-3xl font-bold text-gray-800">
                {filteredSchedule.length * 1.5}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Classrooms</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.class_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("day")}
              className={`p-2 rounded-lg transition ${
                viewMode === "day"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Day View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`p-2 rounded-lg transition ${
                viewMode === "week"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title="Week View"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule View */}
      {filteredSchedule.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No classes scheduled yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first class to the schedule
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Your First Class
          </button>
        </div>
      ) : viewMode === "week" ? (
        <WeekView 
          daysOfWeek={daysOfWeek}
          timeSlots={timeSlots}
          getClassesForDay={getClassesForDay}
          onDeleteClass={handleDeleteClass}
        />
      ) : (
        <DayView 
          todayClasses={getTodayClasses()}
          onDeleteClass={handleDeleteClass}
        />
      )}

      {/* Add Class Modal */}
      {showAddModal && (
        <AddClassModal
          courses={courses}
          classrooms={classrooms}
          teachers={teachers}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddClass}
        />
      )}
    </div>
  );
};

const WeekView = ({ daysOfWeek, timeSlots, getClassesForDay, onDeleteClass }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                Time
              </th>
              {daysOfWeek.map((day) => (
                <th
                  key={day}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeSlots.map((time) => (
              <tr key={time} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-600 border-r">
                  {time}
                </td>
                {daysOfWeek.map((day) => {
                  const classes = getClassesForDay(day).filter(
                    c => c.startTime === time
                  );
                  return (
                    <td key={day} className="px-2 py-2 relative">
                      {classes.map((classItem) => (
                        <ClassCard 
                          key={classItem.id} 
                          classItem={classItem}
                          onDelete={onDeleteClass}
                        />
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DayView = ({ todayClasses, onDeleteClass }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Today's Schedule</h2>
      {todayClasses.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No classes today
          </h3>
          <p className="text-gray-600">Enjoy your day off!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todayClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{classItem.title}</h3>
                  <p className="text-sm text-gray-600">{classItem.course}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${classItem.color}-100 text-${classItem.color}-800`}>
                    {classItem.day}
                  </span>
                  <button
                    onClick={() => onDeleteClass(classItem.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{classItem.startTime} - {classItem.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{classItem.classroom}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{classItem.course}</span>
                </div>
              </div>
              {classItem.teacher && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Teacher:</span>
                    <span>{classItem.teacher}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClassCard = ({ classItem, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);
  
  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div
        className={`bg-${classItem.color}-50 border-l-4 border-${classItem.color}-500 rounded p-2 mb-2 hover:shadow-md transition cursor-pointer`}
      >
        <div className="text-xs font-bold text-gray-800 mb-1">{classItem.title}</div>
        {classItem.teacher && (
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
            <Users className="w-3 h-3" />
            <span>{classItem.teacher}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <Clock className="w-3 h-3" />
          <span>{classItem.startTime} - {classItem.endTime}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <MapPin className="w-3 h-3" />
          <span>{classItem.classroom}</span>
        </div>
      </div>
      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(classItem.id);
          }}
          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow-lg transition-all"
          title="Delete Class"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

const AddClassModal = ({ courses, classrooms, teachers, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    course_id: "",
    classroom_id: "",
    teacher_id: "",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:30",
  });

  const colors = ["blue", "purple", "green", "orange", "indigo"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Ensure courses and classrooms are arrays
  const coursesList = Array.isArray(courses) ? courses : [];
  const classroomsList = Array.isArray(classrooms) ? classrooms : [];
  const teachersList = Array.isArray(teachers) ? teachers : [];

  // Debug: Log to see what data we have
  console.log('Courses in modal:', coursesList);
  console.log('Classrooms in modal:', classroomsList);
  console.log('Teachers in modal:', teachersList);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.course_id || !formData.classroom_id || !formData.teacher_id) {
      toast.error("Please select course, classroom, and teacher");
      return;
    }

    const selectedCourse = coursesList.find(c => c.id.toString() === formData.course_id);
    const selectedClassroom = classroomsList.find(c => c.id.toString() === formData.classroom_id);
    const selectedTeacher = teachersList.find(t => t.id.toString() === formData.teacher_id);

    const newClass = {
      title: selectedCourse?.name || "New Class",
      course: selectedCourse?.name || "Course",
      classroom: selectedClassroom?.class_name || "Classroom",
      teacher: `${selectedTeacher?.first_name || ''} ${selectedTeacher?.last_name || ''}`.trim() || "Teacher",
      classroom_id: parseInt(formData.classroom_id),
      course_id: parseInt(formData.course_id),
      teacher_id: parseInt(formData.teacher_id),
      day: formData.day,
      startTime: formData.startTime,
      endTime: formData.endTime,
      color: colors[Math.floor(Math.random() * colors.length)],
    };

    onAdd(newClass);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Add New Class</h2>
            <p className="text-green-100 text-sm">Schedule a new class session</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a course</option>
                {coursesList.length === 0 ? (
                  <option value="" disabled>No courses available</option>
                ) : (
                  coursesList.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))
                )}
              </select>
              {coursesList.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No courses found. Please add courses first.</p>
              )}
            </div>

            {/* Classroom Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classroom *
              </label>
              <select
                name="classroom_id"
                value={formData.classroom_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a classroom</option>
                {classroomsList.length === 0 ? (
                  <option value="" disabled>No classrooms available</option>
                ) : (
                  classroomsList.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                      {classroom.class_name}
                    </option>
                  ))
                )}
              </select>
              {classroomsList.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No classrooms found. Please add classrooms first.</p>
              )}
            </div>

            {/* Teacher Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teacher *
              </label>
              <select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a teacher</option>
                {teachersList.length === 0 ? (
                  <option value="" disabled>No teachers available</option>
                ) : (
                  teachersList.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))
                )}
              </select>
              {teachersList.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No teachers found. Please add teachers first.</p>
              )}
            </div>

            {/* Day Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Day of Week *
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherSchedule;
