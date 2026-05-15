import { useState } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Edit,
  UserX,
  Trash2,
} from "lucide-react";
import { useGetUserQuery, useDeactivateUserMutation, useDeleteUserMutation } from "../../redux/hooks/userApiSlice";
import { toast } from "react-toastify";

const TeacherStudents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const { data: usersResponse, isLoading, isError, refetch } = useGetUserQuery();
  const [deactivateUser] = useDeactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading students...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading students</div>
      </div>
    );
  }

  const allUsers = usersResponse?.data?.data || usersResponse?.data || [];
  const students = Array.isArray(allUsers) 
    ? allUsers.filter(user => user.role === 'student')
    : [];

  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "active" && student.status === 1) ||
      (filterStatus === "inactive" && student.status === 0);
    
    return matchesSearch && matchesStatus;
  });

  const activeStudents = students.filter(s => s.status === 1).length;
  const inactiveStudents = students.filter(s => s.status === 0).length;

  const handleToggleStatus = async (studentId, currentStatus, studentName) => {
    const action = currentStatus === 1 ? "deactivate" : "activate";
    const confirmMessage = `Are you sure you want to ${action} ${studentName}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deactivateUser(studentId).unwrap();
        toast.success(`Student ${action}d successfully!`);
        refetch();
      } catch (error) {
        toast.error(`Failed to ${action} student`);
      }
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    const confirmMessage = `Are you sure you want to delete ${studentName}? This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await deleteUser(studentId).unwrap();
        toast.success("Student deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Students</h1>
        <p className="text-gray-600">
          View and manage your students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-green-600" />}
          title="Total Students"
          value={students.length}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title="Active Students"
          value={activeStudents}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Users className="w-6 h-6 text-gray-600" />}
          title="Inactive Students"
          value={inactiveStudents}
          bgColor="bg-gray-50"
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No students found
          </h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "No students enrolled yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <StudentRow 
                    key={student.id} 
                    student={student}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteStudent}
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

const StudentRow = ({ student, onToggleStatus, onDelete }) => {
  const handleEdit = () => {
    // Edit functionality - can be implemented later
    console.log("Edit student:", student.id);
  };

  const handleToggle = () => {
    const studentName = `${student.first_name} ${student.last_name}`;
    onToggleStatus(student.id, student.status, studentName);
  };

  const handleDelete = () => {
    const studentName = `${student.first_name} ${student.last_name}`;
    onDelete(student.id, studentName);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium">
            {student.first_name.charAt(0)}
            {student.last_name.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {student.first_name} {student.last_name}
            </div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {student.email}
          </div>
          {student.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              {student.phone}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(student.created_at).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            student.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {student.status === 1 ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            className={`p-2 rounded-lg transition ${
              student.status === 1
                ? "text-green-600 hover:bg-green-50"
                : "text-red-600 hover:bg-red-50"
            }`}
            title={student.status === 1 ? "Deactivate Student" : "Activate Student"}
          >
            <UserX className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete Student"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TeacherStudents;
