
import {
  Eye,
  Edit3,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const CourseTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
 
  const [courses, setCourses] = useState([
    {
      courseID: "001",
      courseName: "Math",
      teacher: "John Doe",
      status: "Active",
    },
    {
      courseID: "002",
      courseName: "Science",
      teacher: "Jane Smith",
      status: "Disactive",
    },
    {
      courseID: "003",
      courseName: "English",
      teacher: "David Lee",
      status: "Active",
    },
    {
      courseID: "004",
      courseName: "Math",
      teacher: "John Doe",
      status: "Active",
    },
    {
      courseID: "005",
      courseName: "Science",
      teacher: "Jane Smith",
      status: "Disactive",
    },
    {
      courseID: "006",
      courseName: "English",
      teacher: "David Lee",
      status: "Active",
    },
  ]);

  const handleStatusChange = (id, status) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.courseID === id ? { ...course, status: status } : course
      )
    );
    console.log("Course status updated:", id, status);
  };

  const handleEdit = (id) => {
    console.log("Edit course with ID:", id);
    // implement your edit logic or navigation here
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Disactive":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseID.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || course.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-fulls mx-auto">
      <div className="sm:flex sm:justify-between sm:items-center mb-4">
        <div className="sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-2">
            Course Management
          </h1>
          <p className="text-sm text-slate-500">
            Manage and monitor all courses in the system
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Courses</option>
            <option value="Active">Active</option>
            <option value="Disactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
              <tr>
                <th className="px-2 py-3 text-left">Course ID</th>
                <th className="px-2 py-3 text-left">Course Name</th>
                <th className="px-2 py-3 text-left">Teacher</th>
                <th className="px-2 py-3 text-center">Status</th>
                <th className="px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200">
              {filteredCourses.map((item) => (
                <tr key={item.courseID}>
                  <td className="px-2 py-3">{item.courseID}</td>
                  <td className="px-2 py-3 font-medium text-slate-800">
                    {item.courseName}
                  </td>
                  <td className="px-2 py-3">{item.teacher}</td>
                  <td className="px-2 py-3 text-center">
                    {getStatusIcon(item.status)}
                  </td>
                  <td className="px-2 py-6">
                    <div className="flex items-center justify-center space-x-2">
                      {/* <button className="text-slate-400 hover:text-slate-500">
                        <Eye className="w-4 h-4" />
                      </button> */}
                      <button
                        className="text-slate-400 hover:text-slate-500"
                        onClick={() => handleEdit(item.courseID)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            item.courseID,
                            item.status === "Active" ? "Disactive" : "Active"
                          )
                        }
                        className="text-slate-400 hover:text-slate-500"
                      >
                        {item.status === "Active" ? (
                          <span className="text-red-500 text-xs px-1 bg-red-50 border border-red-200 rounded-4xl">
                            Disactive
                          </span>
                        ) : (
                          <span className="text-green-500 text-xs px-1 bg-green-50 border border-green-200 rounded-4xl">
                            Active
                          </span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-slate-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseTable;
