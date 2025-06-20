import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "../../../Layout/Admin/Layout";
import Header from "../../../Layout/Admin/Header";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Layout />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
