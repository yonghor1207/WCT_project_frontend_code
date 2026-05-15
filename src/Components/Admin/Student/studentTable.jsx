import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeactivateUserMutation, useGetUserQuery, useDeleteUserMutation } from "../../../redux/hooks/userApiSlice";
import { toast } from "react-toastify";
import StudentTableComponent from "./StudentTableComponent";

const studentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  const { data: studentData, isLoading, refetch } = useGetUserQuery();
  const [students, setStudents] = useState([]);

  console.log("users data", studentData);
  useEffect(() => {
    if (studentData?.data?.data) {
      // Filter users with role === 'teacher'
      const studentOnly = studentData.data.data.filter(
        (user) => user.role === "student"
      );
      setStudents(studentOnly);
    }
  }, [studentData]);


  const filteredStudents = Array.isArray(students)
    ? students.filter((teacher) =>
      `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (teacher.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleEdit = (teacher) => {
    console.log("Edit teacher:", teacher.id);
    navigate(`${teacher.id}`);
  };


  const [deactivateUser] = useDeactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();


  const handleToggleStatus = async (teacherId) => {
    setSelectedStudent(teacherId);
    console.log("toggle:", teacherId);
    try {
      if (!teacherId) {
        console.error("Teacher not found");
        return;
      }
      console.log("teachr id: ", teacherId);
      await deactivateUser(teacherId).unwrap();
      await refetch();
      toast.success("Deactivate successfully!", {
        position: "top-right"
      })
      // navigate("/teacher");
    } catch (error) {
      toast.error("Deactivate not successfull!");
      console.error("Failed to toggle teacher status:", error);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        await deleteUser(studentId).unwrap();
        await refetch();
        toast.success("Student deleted successfully!", {
          position: "top-right"
        });
      } catch (error) {
        console.error("Failed to delete student:", error);
        
        // Check if it's a 404 or endpoint not found error
        if (error?.status === 404 || error?.status === 405) {
          toast.error("Delete feature is not available yet. Please contact your administrator.", {
            position: "top-right",
            autoClose: 5000
          });
        } else {
          toast.error(error?.data?.message || "Failed to delete student. Please try again.", {
            position: "top-right"
          });
        }
      }
    }
  };

  const addNew = () => {
    navigate("createStudent");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Management
            </h1>
            <p className="text-gray-600">Manage your students efficiently</p>
          </div>
          <button
            onClick={addNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, department, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button> */}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {students.length}
            </div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {
                students.filter(
                  (t) => t.status === "active" || t.status === 1
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Active Students</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {
                students.filter(
                  (t) => t.status === "inactive" || t.status === 0
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Inactive Students</div>
          </div>
        </div>

        {/* Teacher Table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <StudentTableComponent
            students={filteredStudents}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default studentTable;
