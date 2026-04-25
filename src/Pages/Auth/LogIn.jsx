import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/hooks/authApiSlice";

const LogIn = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(loginSuccess(res));
      toast('Login Success', {
        position: "top-right"
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-600">
            School Management System
          </h1>
        </div>

        {/* Sign In Title */}
        <h2 className="text-3xl text-left font-bold text-blue-600 mb-6">
          Sign In
        </h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <h1 className="text-left font-medium text-gray-500 mb-1">Email</h1>
            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <h1 className="text-left font-medium text-gray-500 mb-1">
              Password
            </h1>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition-all"
          >
            Sign In
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-sm text-left font-medium text-gray-600">
          You do not have an account yet?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline text-center"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
