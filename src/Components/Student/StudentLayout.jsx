import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../../Layout/Student/Footer";
import Header from "../../../Layout/Student/Header";

const StudentLayout = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;
