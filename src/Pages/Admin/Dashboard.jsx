import React from "react";
import Card from "../../Components/Admin/Dashborad/card";
import Graph from "../../Components/Admin/Dashborad/graph";

const Dashboard = () => {
  return (
    <div className="min-h-screenp-6">
      <div className="mx-auto">
        <div className="mb-4 text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome to your dashboard. Here you can monitor and manage your
            school system.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <Card />
        </div>

        {/* Charts */}
        <div>
          <Graph />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
