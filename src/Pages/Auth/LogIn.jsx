import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/hooks/authApiSlice";
import { GraduationCap, Shield, Users, BookOpen } from "lucide-react";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("admin");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const roles = [
    { value: "admin", label: "Admin", icon: Shield, color: "blue" },
    { value: "teacher", label: "Teacher", icon: BookOpen, color: "green" },
    { value: "student", label: "Student", icon: GraduationCap, color: "purple" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password, role: selectedRole }).unwrap();
      
      // Backend wraps response in { status, message, data }
      const responseData = res.data || res;
      
      // Check if teacher account is pending approval (status = 0)
      if (responseData.user.role === "teacher" && responseData.user.status === 0) {
        toast.warning("Your account is pending admin approval. Please wait for approval.");
        return;
      }

      dispatch(loginSuccess(responseData));
      toast("Login Success", {
        position: "top-right",
      });
      setTimeout(() => {
        // Navigate based on role
        if (responseData.user.role === "admin") {
          navigate("/dashboard");
        } else if (responseData.user.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }, 1500);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            School Management System
          </h1>
        </div>

        {/* Sign In Title */}
        <h2 className="text-3xl text-center font-bold text-indigo-600 mb-6">
          Sign In
        </h2>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === role.value
                      ? `border-${role.color}-500 bg-${role.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${
                      selectedRole === role.value
                        ? `text-${role.color}-600`
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      selectedRole === role.value
                        ? `text-${role.color}-700`
                        : "text-gray-600"
                    }`}
                  >
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
