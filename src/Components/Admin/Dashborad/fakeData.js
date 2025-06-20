export const dashboardData = {
  totalStudents: {
    value: 1295,
    change: "+12% from last month",
    isPositive: true,
  },
  activeTeachers: {
    value: 94,
    change: "+3 new this month",
    isPositive: true,
  },
  totalClasses: {
    value: 48,
    change: "2 new classes added",
    isPositive: true,
  },
  revenue: {
    value: 89420,
    change: "+8% from last month",
    isPositive: true,
  },
};

export const graphData = {
  monthlyStudents: [
    { month: "Jan", students: 980, newStudents: 45, revenue: 65000 },
    { month: "Feb", students: 1050, newStudents: 70, revenue: 70000 },
    { month: "Mar", students: 1120, newStudents: 70, revenue: 75000 },
    { month: "Apr", students: 1180, newStudents: 60, revenue: 78000 },
    { month: "May", students: 1240, newStudents: 60, revenue: 82000 },
    { month: "Jun", students: 1295, newStudents: 55, revenue: 89420 },
  ],

  weeklyActivity: [
    { day: "Mon", activeUsers: 890, completedLessons: 234 },
    { day: "Tue", activeUsers: 945, completedLessons: 278 },
    { day: "Wed", activeUsers: 1020, completedLessons: 312 },
    { day: "Thu", activeUsers: 1100, completedLessons: 289 },
    { day: "Fri", activeUsers: 980, completedLessons: 256 },
    { day: "Sat", activeUsers: 650, completedLessons: 189 },
    { day: "Sun", activeUsers: 580, completedLessons: 145 },
  ],

  subjectDistribution: [
    { subject: "Mathematics", students: 385, color: "#3B82F6" },
    { subject: "Science", students: 290, color: "#10B981" },
    { subject: "English", students: 245, color: "#8B5CF6" },
    { subject: "History", students: 180, color: "#F59E0B" },
    { subject: "Art", students: 120, color: "#EF4444" },
    { subject: "Music", students: 75, color: "#6B7280" },
  ],

  teacherPerformance: [
    { teacher: "Sarah Johnson", students: 45, satisfaction: 4.8, classes: 8 },
    { teacher: "Michael Chen", students: 38, satisfaction: 4.6, classes: 6 },
    { teacher: "Emily Davis", students: 42, satisfaction: 4.7, classes: 7 },
    { teacher: "James Wilson", students: 35, satisfaction: 4.5, classes: 5 },
    { teacher: "Lisa Anderson", students: 40, satisfaction: 4.9, classes: 6 },
    { teacher: "David Brown", students: 33, satisfaction: 4.4, classes: 5 },
  ],

  revenueBySource: [
    { source: "Monthly Subscriptions", amount: 45000, percentage: 50.3 },
    { source: "Course Purchases", amount: 25000, percentage: 28.0 },
    { source: "Private Tutoring", amount: 12000, percentage: 13.4 },
    { source: "Certification Fees", amount: 7420, percentage: 8.3 },
  ],
};
