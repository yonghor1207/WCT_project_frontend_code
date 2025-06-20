import React from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { dashboardData } from "./fakeData";

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
            {typeof value === "number" && title === "Revenue"
              ? `$${value.toLocaleString()}`
              : value.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
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
  const stats = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents.value,
      change: dashboardData.totalStudents.change,
      isPositive: dashboardData.totalStudents.isPositive,
      icon: Users,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Teachers",
      value: dashboardData.activeTeachers.value,
      change: dashboardData.activeTeachers.change,
      isPositive: dashboardData.activeTeachers.isPositive,
      icon: GraduationCap,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Total Classes",
      value: dashboardData.totalClasses.value,
      change: dashboardData.totalClasses.change,
      isPositive: dashboardData.totalClasses.isPositive,
      icon: BookOpen,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Revenue",
      value: dashboardData.revenue.value,
      change: dashboardData.revenue.change,
      isPositive: dashboardData.revenue.isPositive,
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
