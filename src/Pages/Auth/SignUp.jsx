import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
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
          Sign Up
        </h2>

        {/* Form */}
        <form className="space-y-4">
          {/* Username */}
          <div>
            <h1 className="text-left font-medium text-gray-500 mb-1">
              Username
            </h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <h1 className="text-left font-medium text-gray-500 mb-1">Email</h1>
            <div className="relative">
              <input
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
            Sign Up
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-sm text-left font-medium text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline text-center"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
