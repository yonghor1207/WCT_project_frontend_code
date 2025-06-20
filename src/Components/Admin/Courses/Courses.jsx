import { useState, useEffect } from "react";
import { Plus, Search, Filter, BookOpen, GraduationCap,CheckCircle,XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeactivatedCourseMutation, useGetCourseQuery } from "../../../redux/hooks/courseApiSlice";
import CourseTableComponent from "./CourseTableComponent";
import StatCard from "./StatCard";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();

  const { data: courseData, isLoading, refetch } = useGetCourseQuery();
  const [courses, setCourses] = useState([]);
  console.log("course data:", courseData?.data);
  useEffect(() => {
    if (courseData?.data?.data) {
      setCourses(courseData.data.data);
    }
  }, [courseData]);

  const filteredCourses = Array.isArray(courses)
    ? courses.filter((course) => // Fixed typo in variable name (was courese)
      `${course.name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${course.teacher?.first_name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${course.teacher?.last_name ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleEdit = (course) => { // Fixed typo in parameter name
    console.log("course id:", course.id);
    navigate(`${course.id}`);
  };

  const [deactivateCourse] = useDeactivatedCourseMutation();

  const handleToggleStatus = async (courseId) => {
    setSelectedCourse(courseId); // Changed from setSelectedStudent
    try {
      if (!courseId) {
        toast.error("Course not found");
        return;
      }
      await deactivateCourse(courseId).unwrap();
      await refetch();
      toast.success("Status updated successfully!", {
        position: "top-right"
      });
    } catch (error) {
      toast.error("Failed to update course status!");
      console.error("Failed to toggle course status:", error);
    }
  };

  const addNew = () => {
    navigate("createCourse"); // Changed from createStudent
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Management
            </h1>
            <p className="text-gray-600">Manage your courses efficiently</p>
          </div>
          <button
            onClick={addNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by name or teacher..."
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
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title={"Total Courses"}
            color={"bg-blue-500"}
            value={courses.length}
            icon={BookOpen}
          />
          <StatCard
            title={"Total Teachers"}
            color={"bg-purple-500"}
            value={[...new Set(courses.map(course => course.teacher?.id))].length}
            icon={GraduationCap}
          />
          <StatCard
            title={"Total Active Courses"}
            color={"bg-green-500"}
            value={courses.filter(course => course.status === "active" || course.status === 1).length}
            icon={CheckCircle}
          />
          <StatCard
            title={"Total inactive Courses"}
            color={"bg-red-500"}
            value={courses.filter(course => course.status === "inactive" || course.status === 0).length}
            icon={XCircle}
          />
        </div>

        {/* Course Table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {searchTerm ? "No matching courses found" : "No courses available"}
          </div>
        ) : (
          <CourseTableComponent
            courses={filteredCourses}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Courses;