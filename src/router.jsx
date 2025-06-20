import { createBrowserRouter } from "react-router-dom";
import LogIn from "./Pages/Auth/LogIn";
import SignUp from "./Pages/Auth/SignUp";
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
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/teacher",
        element: <Teacher />,
      },
      {
        path: "/teacher/createTeacher",
        element: <AddTeacher />,
      },
      {
        path: "/teacher/:id",
        element: <AddTeacher />,
      },

      {
        path: "/student",
        element: <Student />,
      },
      {
        path: "/student/createStudent",
        element: <AddStudent />,
      },
      {
        path: "/student/:id",
        element: <AddStudent />,
      },
      {
        path: "/attendance",
        element: <Attendance />,
      },
      {
        path: "/attendance/createAttendance",
        element: <AddAttendance />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/payment/createPayment",
        element: <AddPayment />,
      },
      {
        path: "/payment/:id",
        element: <AddPayment />,
      },
      // {
      //   path: "/schedule",
      //   element: <Schedule />,
      // },
      {
        path: "/classroom",
        element: <Classrooms />,
      },
      {
        path: "/classroom/createClassroom",
        element: <AddClassroom />,
      },
      {
        path: "/classroom/:id",
        element: <AddClassroom />,
      },
      {
        path: "/course",
        element: <Course />,
      },
      {
        path: "/course/createCourse",
        element: <AddCourse />,
      },
      {
        path: "/course/:id",
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
