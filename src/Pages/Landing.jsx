import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BookOpen,
  Users,
  Calendar,
  DollarSign,
  ClipboardCheck,
  GraduationCap,
  CheckCircle,
  BarChart3,
  Shield,
  Zap,
  Mail,
  Phone,
  MapPin,
  User,
} from "lucide-react";

const Landing = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">SchoolMS</h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition">
              How It Works
            </a>
            <a href="#about" className="text-gray-600 hover:text-indigo-600 transition">
              About Us
            </a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 transition">
              Contact
            </a>
          </nav>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <User className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Manage Your School <span className="text-indigo-600">Effortlessly</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive platform to manage students, teachers, courses, attendance, and payments all in one place.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-medium shadow-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-medium shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-50 transition text-lg font-medium border-2 border-indigo-600"
                >
                  Login
                </Link>
              </>
            )}
          </div>
          <div className="mt-12 flex justify-center gap-8 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Easy setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your School
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to simplify school administration and enhance learning experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-10 h-10 text-indigo-600" />}
              title="Student & Teacher Management"
              description="Easily manage student and teacher profiles, roles, and information in one centralized system."
            />
            <FeatureCard
              icon={<BookOpen className="w-10 h-10 text-indigo-600" />}
              title="Course Management"
              description="Create, organize, and manage courses with detailed information and assignments."
            />
            <FeatureCard
              icon={<Calendar className="w-10 h-10 text-indigo-600" />}
              title="Class Scheduling"
              description="Schedule classes efficiently and avoid conflicts with our smart scheduling system."
            />
            <FeatureCard
              icon={<ClipboardCheck className="w-10 h-10 text-indigo-600" />}
              title="Attendance Tracking"
              description="Track student attendance in real-time and generate comprehensive reports."
            />
            <FeatureCard
              icon={<DollarSign className="w-10 h-10 text-indigo-600" />}
              title="Payment Management"
              description="Handle tuition payments, track payment history, and send automated reminders."
            />
            <FeatureCard
              icon={<GraduationCap className="w-10 h-10 text-indigo-600" />}
              title="Classroom Organization"
              description="Organize students into classrooms and manage classroom resources effectively."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your account in seconds. No credit card required to get started."
            />
            <StepCard
              number="2"
              title="Set Up Your School"
              description="Add your teachers, students, courses, and classrooms to the system."
            />
            <StepCard
              number="3"
              title="Start Managing"
              description="Begin tracking attendance, managing payments, and organizing your school efficiently."
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern technology and designed for ease of use
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard
              icon={<Zap className="w-8 h-8 text-indigo-600" />}
              title="Fast & Efficient"
              description="Lightning-fast performance for smooth operations"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8 text-indigo-600" />}
              title="Secure & Reliable"
              description="Your data is protected with enterprise-grade security"
            />
            <BenefitCard
              icon={<BarChart3 className="w-8 h-8 text-indigo-600" />}
              title="Insightful Reports"
              description="Generate detailed reports and analytics"
            />
            <BenefitCard
              icon={<Users className="w-8 h-8 text-indigo-600" />}
              title="User Friendly"
              description="Intuitive interface that anyone can use"
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6">About Us</h3>
              <p className="text-lg mb-4 text-indigo-100">
                We are dedicated to transforming education management through innovative technology solutions.
                Our School Management System is designed to simplify administrative tasks and enhance the
                educational experience for everyone involved.
              </p>
              <p className="text-lg text-indigo-100">
                With years of experience in educational technology, we understand the unique challenges schools
                face. Our platform is built to address these challenges with powerful, easy-to-use tools that
                save time and improve efficiency.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <div className="space-y-6">
                <StatCard number="500+" label="Schools Using Our System" />
                <StatCard number="50,000+" label="Active Students" />
                <StatCard number="5,000+" label="Teachers & Staff" />
                <StatCard number="99.9%" label="Uptime Guarantee" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <ContactInfo
                icon={<Mail className="w-6 h-6 text-indigo-600" />}
                title="Email"
                info="support@schoolms.com"
              />
              <ContactInfo
                icon={<Phone className="w-6 h-6 text-indigo-600" />}
                title="Phone"
                info="+1 (555) 123-4567"
              />
              <ContactInfo
                icon={<MapPin className="w-6 h-6 text-indigo-600" />}
                title="Address"
                info="123 Education Street, Learning City, ED 12345"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-8 h-8 text-indigo-400" />
                <h4 className="text-xl font-bold">SchoolMS</h4>
              </div>
              <p className="text-gray-400">
                Empowering education through innovative management solutions.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 School Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }) => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const StatCard = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-indigo-100">{label}</div>
    </div>
  );
};

const ContactInfo = ({ icon, title, info }) => {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600">{info}</p>
      </div>
    </div>
  );
};

export default Landing;
