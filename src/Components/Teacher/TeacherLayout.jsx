import { Outlet } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import TeacherHeader from "./TeacherHeader";

const TeacherLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <TeacherSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TeacherHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
