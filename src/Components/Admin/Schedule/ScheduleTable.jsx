import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Users,
  BookOpen,
  MapPin,
  Eye,
} from "lucide-react";
import ScheduleHeader from "./ScheduleHeader";

const scheduleTable = () => {
  const [currentView, setCurrentView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");

  // Sample schedule data
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      course: "Mathematics",
      teacher: "Dr. Sarah Johnson",
      grade: "10A",
      room: "Room 101",
      startTime: "08:00",
      endTime: "09:00",
      day: "Monday",
      students: 28,
      color: "bg-blue-500",
    },
    {
      id: 2,
      course: "Physics",
      teacher: "Prof. Michael Chen",
      grade: "11B",
      room: "Lab 201",
      startTime: "09:15",
      endTime: "10:15",
      day: "Monday",
      students: 25,
      color: "bg-green-500",
    },
    {
      id: 3,
      course: "Chemistry",
      teacher: "Dr. Emily Davis",
      grade: "12A",
      room: "Lab 202",
      startTime: "10:30",
      endTime: "11:30",
      day: "Monday",
      students: 22,
      color: "bg-purple-500",
    },
    {
      id: 4,
      course: "English Literature",
      teacher: "Ms. Amanda Wilson",
      grade: "9C",
      room: "Room 205",
      startTime: "11:45",
      endTime: "12:45",
      day: "Monday",
      students: 30,
      color: "bg-orange-500",
    },
    {
      id: 5,
      course: "History",
      teacher: "Mr. Robert Brown",
      grade: "10B",
      room: "Room 103",
      startTime: "08:00",
      endTime: "09:00",
      day: "Tuesday",
      students: 26,
      color: "bg-red-500",
    },
  ]);

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const grades = [
    "9A",
    "9B",
    "9C",
    "10A",
    "10B",
    "10C",
    "11A",
    "11B",
    "12A",
    "12B",
  ];

  const getScheduleForDayAndTime = (day, time) => {
    return schedules.find(
      (schedule) => schedule.day === day && schedule.startTime === time
    );
  };

  const handleAddSchedule = (newSchedule) => {
    const schedule = {
      ...newSchedule,
      id: schedules.length + 1,
      color: `bg-${
        [
          "blue",
          "green",
          "purple",
          "orange",
          "red",
          "yellow",
          "pink",
          "indigo",
        ][Math.floor(Math.random() * 8)]
      }-500`,
    };
    setSchedules([...schedules, schedule]);
    setShowAddModal(false);
  };

  const handleEditSchedule = (updatedSchedule) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
    setShowEditModal(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    }
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterGrade === "all" || schedule.grade === filterGrade;
    return matchesSearch && matchesFilter;
  });

  const ScheduleModal = ({ isOpen, onClose, onSubmit, schedule, title }) => {
    const [formData, setFormData] = useState(
      schedule || {
        course: "",
        teacher: "",
        grade: "",
        room: "",
        startTime: "",
        endTime: "",
        day: "Monday",
        students: "",
      }
    );

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
      setFormData({
        course: "",
        teacher: "",
        grade: "",
        room: "",
        startTime: "",
        endTime: "",
        day: "Monday",
        students: "",
      });
    };

    // add new schedule
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) =>
                  setFormData({ ...formData, teacher: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Grade/Class
              </label>
              <select
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Grade</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Room</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <select
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Students
              </label>
              <input
                type="number"
                value={formData.students}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    students: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  onSubmit(formData);
                  setFormData({
                    course: "",
                    teacher: "",
                    grade: "",
                    room: "",
                    startTime: "",
                    endTime: "",
                    day: "Monday",
                    students: "",
                  });
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {schedule ? "Update" : "Add"} Schedule
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 min-h-screen">
      {/* Header Component */}
      <ScheduleHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterGrade={filterGrade}
        setFilterGrade={setFilterGrade}
        grades={grades}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowAddModal={setShowAddModal}
      />
      {/* List View */}
      {currentView === "list" && (
        <div className="rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-700">
                    course
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Teacher
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Grade
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Room
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Day
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Time
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Students
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${schedule.color}`}
                        ></div>
                        <span className="font-medium">{schedule.course}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{schedule.teacher}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {schedule.grade}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 flex items-center gap-1">
                      <MapPin size={16} />
                      {schedule.room}
                    </td>
                    <td className="p-4 text-gray-600">{schedule.day}</td>
                    <td className="p-4 text-gray-600 flex items-center gap-1">
                      <Clock size={16} />
                      {schedule.startTime} - {schedule.endTime}
                    </td>
                    <td className="p-4 text-gray-600 flex items-center gap-1">
                      <Users size={16} />
                      {schedule.students}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modals */}
      <ScheduleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSchedule}
        title="Add New Schedule"
      />
      <ScheduleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSchedule(null);
        }}
        onSubmit={handleEditSchedule}
        schedule={selectedSchedule}
        title="Edit Schedule"
      />
    </div>
  );
};

export default scheduleTable;
