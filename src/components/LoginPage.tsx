import React, { useState } from 'react';
import { Building2, LogIn, Users, Shield, Wrench, Eye, EyeOff, UserCheck } from 'lucide-react';
import { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.student@hostel.com',
    role: 'student' as const,
    roomNumber: 'A-101',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'Dr. Smith',
    email: 'smith.warden@hostel.com',
    role: 'warden' as const,
    designation: 'Chief Warden',
    department: 'Block A & B'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.housekeeping@hostel.com',
    role: 'housekeeping' as const,
    designation: 'Housekeeping Supervisor',
    department: 'Maintenance'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.security@hostel.com',
    role: 'security' as const,
    designation: 'Security Officer',
    department: 'Security'
  }
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      onLogin(user);
    }
  };

  const quickLogin = (role: string) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword('password123');
      setSelectedRole(role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">
        {/* Left Panel - Branding */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Campus Connect</h1>
            <p className="text-gray-600">Hostel Management Platform</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Login Options</h3>
            
            <button
              onClick={() => quickLogin('student')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Student Portal</div>
                <div className="text-sm text-gray-600">Complaints, Events, Notices</div>
              </div>
            </button>

            <button
              onClick={() => quickLogin('warden')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <Shield className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Warden Portal</div>
                <div className="text-sm text-gray-600">Management & Admin</div>
              </div>
            </button>

            <button
              onClick={() => quickLogin('housekeeping')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
            >
              <Wrench className="w-6 h-6 text-orange-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Housekeeping Portal</div>
                <div className="text-sm text-gray-600">Maintenance Tasks</div>
              </div>
            </button>

            <button
              onClick={() => quickLogin('security')}
              className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <UserCheck className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold text-gray-800">Security Portal</div>
                <div className="text-sm text-gray-600">Security & Attendance</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>

            <div className="text-center text-sm text-gray-500 mt-6">
              Demo credentials are auto-filled when you select a portal above
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;