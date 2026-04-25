import React from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "../../../redux/hooks/dashboardApiSlice";

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  iconBgColor,
  iconColor,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {title === "Revenue"
              ? `$${value.toLocaleString()}`
              : value.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const Card = () => {
  const { data: statsResponse, isLoading, isError } = useGetDashboardStatsQuery();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center text-red-500 p-6">
        Error loading dashboard statistics
      </div>
    );
  }
  
  const dashboardData = statsResponse?.data || {};

  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents?.value || 0,
      change: dashboardData.totalStudents?.change || "0%",
      isPositive: dashboardData.totalStudents?.isPositive || true,
      icon: Users,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Teachers",
      value: dashboardData.activeTeachers?.value || 0,
      change: dashboardData.activeTeachers?.change || "0",
      isPositive: dashboardData.activeTeachers?.isPositive || true,
      icon: GraduationCap,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Classes",
      value: dashboardData.totalClasses?.value || 0,
      change: dashboardData.totalClasses?.change || "0",
      isPositive: dashboardData.totalClasses?.isPositive || true,
      icon: BookOpen,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Revenue",
      value: dashboardData.revenue?.value || 0,
      change: dashboardData.revenue?.change || "0%",
      isPositive: dashboardData.revenue?.isPositive || true,
      icon: DollarSign,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Card;
