import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import TeacherTableComponent from "./TeacherTableComponent";
import { useNavigate } from "react-router-dom";
import { useDeactivateUserMutation, useGetUserByIdQuery, useGetUserQuery } from "../../../redux/hooks/userApiSlice";
import { toast } from "react-toastify";

const TeacherTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigate = useNavigate();

  const { data: teacherData, isLoading, refetch } = useGetUserQuery();
  const [teachers, setTeachers] = useState([]);

  console.log("users data", teacherData);
  useEffect(() => {
    if (teacherData?.data?.data) {
      // Filter users with role === 'teacher'
      const teachersOnly = teacherData.data.data.filter(
        (user) => user.role === "teacher"
      );
      setTeachers(teachersOnly);
    }
  }, [teacherData]);


  const filteredTeachers = Array.isArray(teachers)
    ? teachers.filter((teacher) =>
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


  const handleToggleStatus = async (teacherId) => {
    setSelectedTeacher(teacherId);
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

  const addNew = () => {
    navigate("createTeacher");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Teacher Management
            </h1>
            <p className="text-gray-600">Manage your teaching staff efficiently</p>
          </div>
          <button
            onClick={addNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers by name, department, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {teachers.length}
            </div>
            <div className="text-sm text-gray-600">Total Teachers</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {
                teachers.filter(
                  (t) => t.status === "active" || t.status === 1
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Active Teachers</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">
              {
                teachers.filter(
                  (t) => t.status === "inactive" || t.status === 0
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Inactive Teachers</div>
          </div>
        </div>

        {/* Teacher Table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <TeacherTableComponent
            teachers={filteredTeachers}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherTable;
