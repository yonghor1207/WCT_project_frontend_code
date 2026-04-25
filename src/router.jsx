import { createBrowserRouter } from "react-router-dom";
import LogIn from "./Pages/Auth/LogIn";
import SignUp from "./Pages/Auth/SignUp";
import Landing from "./Pages/Landing";
import AdminLayout from "./Components/Admin/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard";
import Teacher from "./Pages/Admin/Teacher";
import Student from "./Pages/Admin/Student";
import Attendance from "./Pages/Admin/Attendacne";
import Payment from "./Pages/Admin/Payment";
import Schedule from "./Pages/Admin/Schedule";
import Classroom from "./Pages/Admin/Classroom";
import Course from "./Pages/Admin/Course";
import StudentLayout from "./Components/Student/StudentLayout";
import HomePage from "./Pages/Student/HomePage";
import MyCourse from "./Pages/Student/MyCourse";
import ProtectedRoute from "./Components/ProtectRoute";
import AddTeacher from "./Components/Admin/Teacher/AddTeacher";
import AddStudent from "./Components/Admin/Student/AddStudent";
import Classrooms from "./Components/Admin/Classroom/classrooms";
import AddClassroom from "./Components/Admin/Classroom/AddClassroom";
import AddCourse from "./Components/Admin/Courses/AddCourse";
import AddPayment from "./Components/Admin/Payment/AddPayment";
import AddEditAttendance from "./Components/Admin/Attendance/AddAttendance";
import AddAttendance from "./Components/Admin/Attendance/AddAttendance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Teacher />,
      },
      {
        path: "createTeacher",
        element: <AddTeacher />,
      },
      {
        path: ":id",
        element: <AddTeacher />,
      },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Student />,
      },
      {
        path: "createStudent",
        element: <AddStudent />,
      },
      {
        path: ":id",
        element: <AddStudent />,
      },
    ],
  },
  {
    path: "/attendance",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Attendance />,
      },
      {
        path: "createAttendance",
        element: <AddAttendance />,
      },
    ],
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Payment />,
      },
      {
        path: "createPayment",
        element: <AddPayment />,
      },
      {
        path: ":id",
        element: <AddPayment />,
      },
    ],
  },
  {
    path: "/classroom",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Classrooms />,
      },
      {
        path: "createClassroom",
        element: <AddClassroom />,
      },
      {
        path: ":id",
        element: <AddClassroom />,
      },
    ],
  },
  {
    path: "/course",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Course />,
      },
      {
        path: "createCourse",
        element: <AddCourse />,
      },
      {
        path: ":id",
        element: <AddCourse />,
      },
    ],
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  // {
  //   path: "/students/*",
  //   element: <StudentLayout />,
  //   children: [
  //     {
  //       path: "homepage",
  //       element: <HomePage />,
  //     },
  //     {
  //       path: "mycourses",
  //       element: <MyCourse />,
  //     },
  //   ],
  // },
]);

export default router;
