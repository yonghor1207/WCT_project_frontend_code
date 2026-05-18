import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  Grid3x3,
  List,
} from "lucide-react";

const StudentSchedule = () => {
  const [viewMode, setViewMode] = useState("week"); // week, day
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [mySchedule, setMySchedule] = useState([]);

  // Load schedule from teacher's localStorage
  useEffect(() => {
    const teacherSchedule = localStorage.getItem('teacherSchedule');
    if (teacherSchedule) {
      try {
        const scheduleData = JSON.parse(teacherSchedule);
        setMySchedule(scheduleData);
      } catch (error) {
        console.error('Failed to parse teacher schedule:', error);
      }
    }
  }, []);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const getClassesForDay = (day) => {
    return mySchedule.filter(s => s.day === day);
  };

  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return mySchedule.filter(s => s.day === today);
  };

  const todayClasses = getTodayClasses();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Class Schedule</h1>
          <p className="text-gray-600">View your weekly class timetable</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Classes</p>
              <p className="text-4xl font-bold">{mySchedule.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Today's Classes</p>
              <p className="text-4xl font-bold">{todayClasses.length}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Courses</p>
              <p className="text-4xl font-bold">{new Set(mySchedule.map(s => s.course)).size}</p>
            </div>
            <Users className="w-12 h-12 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Weekly Hours</p>
              <p className="text-4xl font-bold">{mySchedule.length * 1.5}h</p>
            </div>
            <Clock className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Weekly Schedule</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("day")}
              className={`p-2 rounded-lg transition ${
                viewMode === "day"
                  ? "bg-purple-100 text-purple-700"
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
                  ? "bg-purple-100 text-purple-700"
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
      {mySchedule.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No classes scheduled yet
          </h3>
          <p className="text-gray-600">
            Your class schedule will appear here once you're enrolled in courses
          </p>
        </div>
      ) : viewMode === "week" ? (
        <WeekView 
          daysOfWeek={daysOfWeek}
          timeSlots={timeSlots}
          getClassesForDay={getClassesForDay}
        />
      ) : (
        <DayView 
          daysOfWeek={daysOfWeek}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          getClassesForDay={getClassesForDay}
        />
      )}
    </div>
  );
};

const WeekView = ({ daysOfWeek, timeSlots, getClassesForDay }) => {
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
                        <ClassCard key={classItem.id} classItem={classItem} />
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

const DayView = ({ daysOfWeek, selectedDay, setSelectedDay, getClassesForDay }) => {
  const dayClasses = getClassesForDay(selectedDay);

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Day Selector */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedDay === day
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Classes List */}
      <div className="p-6">
        {dayClasses.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No classes on {selectedDay}
            </h3>
            <p className="text-gray-600">Enjoy your free day!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{classItem.title}</h3>
                    <p className="text-sm text-gray-600">{classItem.course}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    classItem.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    classItem.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                    classItem.color === 'green' ? 'bg-green-100 text-green-800' :
                    classItem.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {classItem.day}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {classItem.teacher && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{classItem.teacher}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{classItem.startTime} - {classItem.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{classItem.classroom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ClassCard = ({ classItem }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-500',
    purple: 'bg-purple-50 border-purple-500',
    green: 'bg-green-50 border-green-500',
    orange: 'bg-orange-50 border-orange-500',
    indigo: 'bg-indigo-50 border-indigo-500',
  };

  return (
    <div
      className={`${colorClasses[classItem.color] || 'bg-gray-50 border-gray-500'} border-l-4 rounded p-2 mb-2 hover:shadow-md transition cursor-pointer`}
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
  );
};

export default StudentSchedule;
