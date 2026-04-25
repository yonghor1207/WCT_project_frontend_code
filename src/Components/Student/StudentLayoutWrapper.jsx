import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import StudentHeader from "./StudentHeader";

const StudentLayoutWrapper = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayoutWrapper;
