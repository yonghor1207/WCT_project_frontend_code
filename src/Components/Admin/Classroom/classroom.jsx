import React, { useState } from "react";
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Users,
  Monitor,
  Wifi,
  Volume2,
  Projector,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";
import ClassroomHeader from "./classroomHeader";
import ClassroomFooter from "./classroomFooter";
import { useGetClassroomQuery } from "../../../redux/hooks/classroomApiSlice";

const ClassroomTable = () => {
  const [currentView, setCurrentView] = useState("list");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: classroomData, isLoading, error } = useGetClassroomQuery();
  console.table(classroomData);
  // Sample classroom data
  const [classrooms, setClassrooms] = useState([
    // Fake data
    {
      id: 1,
      number: "Room 101",
      name: "Mathematics Lab",
      floor: "1st Floor",
      building: "Main Building",
      type: "Laboratory",
      capacity: 30,
      currentOccupancy: 0,
      status: "available",
      maintenance: {
        lastChecked: "2024-01-15",
        nextMaintenance: "2024-02-15",
        issues: [],
      },
      schedule: [
        {
          subject: "Mathematics",
          grade: "10A",
          time: "08:00-09:00",
          teacher: "Dr. Sarah Johnson",
        },
        {
          subject: "Algebra",
          grade: "11B",
          time: "10:00-11:00",
          teacher: "Prof. Michael Chen",
        },
      ],
    },
    {
      id: 2,
      number: "Room 201",
      name: "Physics Laboratory",
      floor: "2nd Floor",
      building: "Science Block",
      type: "Laboratory",
      capacity: 25,
      currentOccupancy: 22,
      status: "occupied",
      maintenance: {
        lastChecked: "2024-01-10",
        nextMaintenance: "2024-02-10",
        issues: ["Projector bulb needs replacement"],
      },
      schedule: [
        {
          subject: "Physics",
          grade: "12A",
          time: "09:00-10:00",
          teacher: "Dr. Emily Davis",
        },
        {
          subject: "Chemistry",
          grade: "11A",
          time: "11:00-12:00",
          teacher: "Prof. Robert Wilson",
        },
      ],
    },
    {
      id: 3,
      number: "Room 105",
      name: "English Classroom",
      floor: "1st Floor",
      building: "Main Building",
      type: "Regular Classroom",
      capacity: 35,
      currentOccupancy: 0,
      status: "maintenance",
      maintenance: {
        lastChecked: "2024-01-08",
        nextMaintenance: "2024-01-30",
        issues: ["Air conditioning repair needed", "Window lock broken"],
      },
      schedule: [],
    },
    {
      id: 4,
      number: "Hall A",
      name: "Main Auditorium",
      floor: "Ground Floor",
      building: "Main Building",
      type: "Auditorium",
      capacity: 200,
      currentOccupancy: 0,
      status: "available",
      maintenance: {
        lastChecked: "2024-01-12",
        nextMaintenance: "2024-03-01",
        issues: [],
      },
      schedule: [
        {
          subject: "Assembly",
          grade: "All",
          time: "08:00-08:30",
          teacher: "Principal",
        },
      ],
    },
  ]);

  const classroomTypes = [
    "Regular Classroom",
    "Laboratory",
    "Computer Lab",
    "Auditorium",
    "Library",
    "Music Room",
    "Art Room",
  ];
  const buildings = [
    "Building A",
    "Building B",
    "Building C",
    "Building D",
    "Steam Building",
    "Building T",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-100";
      case "occupied":
        return "text-blue-600 bg-blue-100";
      case "maintenance":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle size={16} />;
      case "occupied":
        return <Users size={16} />;
      case "maintenance":
        return <AlertTriangle size={16} />;
      default:
        return <XCircle size={16} />;
    }
  };

  const handleAddClassroom = (newClassroom) => {
    const classroom = {
      ...newClassroom,
      id: classrooms.length + 1,
      currentOccupancy: 0,
      status: "available",
      maintenance: {
        lastChecked: new Date().toISOString().split("T")[0],
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        issues: [],
      },
      schedule: [],
    };
    setClassrooms([...classrooms, classroom]);
    setShowAddModal(false);
  };

  const handleEditClassroom = (updatedClassroom) => {
    setClassrooms(
      classrooms.map((classroom) =>
        classroom.id === updatedClassroom.id ? updatedClassroom : classroom
      )
    );
    setShowEditModal(false);
    setSelectedClassroom(null);
  };

  const handleDeleteClassroom = (id) => {
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      setClassrooms(classrooms.filter((classroom) => classroom.id !== id));
    }
  };

  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || classroom.type === filterType;
    const matchesStatus =
      filterStatus === "all" || classroom.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const ClassroomModal = ({ isOpen, onClose, onSubmit, classroom, title }) => {
    const [formData, setFormData] = useState(
      classroom || {
        number: "",
        name: "",
        floor: "",
        building: "",
        type: "Regular Classroom",
        capacity: "",
      }
    );

    if (!isOpen) return null;

    const handleSubmit = () => {
      onSubmit(formData);
      setFormData({
        number: "",
        name: "",
        floor: "",
        building: "",
        type: "Regular Classroom",
        capacity: "",
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) =>
                    setFormData({ ...formData, number: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Room 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mathematics Lab"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Floor</label>
                <input
                  type="text"
                  value={formData.floor}
                  onChange={(e) =>
                    setFormData({ ...formData, floor: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1st Floor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Building
                </label>
                <select
                  value={formData.building}
                  onChange={(e) =>
                    setFormData({ ...formData, building: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Building</option>
                  {buildings.map((building) => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {classroomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Max students"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {classroom ? "Update" : "Add"} Classroom
              </button>
              <button
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

  const ClassroomDetailsModal = ({ isOpen, onClose, classroom }) => {
    if (!isOpen || !classroom) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {classroom.number} - {classroom.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Basic Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <span>
                    {classroom.floor}, {classroom.building}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-gray-500" />
                  <span>{classroom.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-500" />
                  <span>Capacity: {classroom.capacity} students</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(classroom.status)}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                      classroom.status
                    )}`}
                  >
                    {classroom.status.charAt(0).toUpperCase() +
                      classroom.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Today's Schedule
              </h3>
              <div className="space-y-2">
                {classroom.schedule.length > 0 ? (
                  classroom.schedule.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.subject}</div>
                          <div className="text-sm text-gray-600">
                            {item.grade} • {item.teacher}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock size={14} />
                          {item.time}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No classes scheduled for today
                  </p>
                )}
              </div>
            </div>

            {/* Maintenance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Maintenance
              </h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Last Checked:</span>{" "}
                  {classroom.maintenance.lastChecked}
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Next Maintenance:</span>{" "}
                  {classroom.maintenance.nextMaintenance}
                </div>
                {classroom.maintenance.issues.length > 0 && (
                  <div>
                    <span className="text-gray-600 text-sm">Issues:</span>
                    <ul className="mt-1">
                      {classroom.maintenance.issues.map((issue, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-600 flex items-center gap-1"
                        >
                          <AlertTriangle size={12} />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Component */}
      <ClassroomHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setShowAddModal={setShowAddModal}
        classroomTypes={classroomTypes}
      />

      {/* List View */}
      {currentView === "list" && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Room
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Name
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Location
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Type
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Capacity
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Status
                  </th>
                  <th className="p-4 text-left font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredClassrooms.map((classroom) => (
                  <tr key={classroom.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{classroom.number}</td>
                    <td className="p-4 text-gray-600">{classroom.name}</td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {classroom.floor}, {classroom.building}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
                        {classroom.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        {classroom.currentOccupancy}/{classroom.capacity}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm flex items-center gap-1 w-fit ${getStatusColor(
                          classroom.status
                        )}`}
                      >
                        {getStatusIcon(classroom.status)}
                        {classroom.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedClassroom(classroom);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClassroom(classroom);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClassroom(classroom.id)}
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

      {/* Footer Component */}
      <ClassroomFooter classrooms={classrooms} />

      {/* Modals */}
      <ClassroomModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddClassroom}
        title="Add New Classroom"
      />

      <ClassroomModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClassroom(null);
        }}
        onSubmit={handleEditClassroom}
        classroom={selectedClassroom}
        title="Edit Classroom"
      />

      <ClassroomDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedClassroom(null);
        }}
        classroom={selectedClassroom}
      />
    </div>
  );
};

export default ClassroomTable;
