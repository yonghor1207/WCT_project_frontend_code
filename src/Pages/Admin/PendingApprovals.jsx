import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, Mail, User } from "lucide-react";

const PendingApprovals = () => {
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending teachers from backend
  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/admin/users?status=0", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pending teachers");
      }

      const data = await response.json();
      // Filter only teachers with status 0 (pending)
      const teachers = data.data.data || data.data || [];
      const pendingOnly = teachers.filter(
        (user) => user.role === "teacher" && user.status === 0
      );
      setPendingTeachers(pendingOnly);
    } catch (error) {
      toast.error("Failed to load pending approvals");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (teacherId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${teacherId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve teacher");
      }

      setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacherId));
      toast.success("Teacher approved successfully!");
    } catch (error) {
      toast.error("Failed to approve teacher");
      console.error(error);
    }
  };

  const handleReject = async (teacherId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/users/${teacherId}/deactivate`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject teacher");
      }

      setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacherId));
      toast.success("Teacher rejected");
    } catch (error) {
      toast.error("Failed to reject teacher");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pending Teacher Approvals</h1>
        <p className="text-gray-600 mt-2">Review and approve teacher registration requests</p>
      </div>

      {pendingTeachers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">No pending teacher approvals at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-medium">
                        {teacher.first_name.charAt(0)}
                        {teacher.last_name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.first_name} {teacher.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {teacher.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(teacher.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(teacher.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(teacher.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;
