import React, { useState } from 'react';
import { 
  Shield, MessageSquare, Bell, Users, BarChart3, 
  Settings, LogOut, Menu, X, Home, AlertTriangle
} from 'lucide-react';
import WardenProfile from './WardenProfile';
import WardenComplaints from './WardenComplaints';
import WardenNotices from './WardenNotices';
import WardenSecurity from './WardenSecurity';
import WardenReports from './WardenReports';
import WardenAdmin from './WardenAdmin';
import { User as UserType, Complaint, Notice, SecurityAlert } from '../../App';

interface WardenDashboardProps {
  user: UserType;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  securityAlerts: SecurityAlert[];
  setSecurityAlerts: React.Dispatch<React.SetStateAction<SecurityAlert[]>>;
  housekeepingMessages: any[];
  setHousekeepingMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onLogout: () => void;
}

const WardenDashboard: React.FC<WardenDashboardProps> = ({
  user,
  complaints,
  setComplaints,
  notices,
  setNotices,
  securityAlerts,
  setSecurityAlerts,
  housekeepingMessages,
  setHousekeepingMessages,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: Shield, label: 'Profile' },
    { id: 'complaints', icon: MessageSquare, label: 'Complaint Management' },
    { id: 'notices', icon: Bell, label: 'Notice Management' },
    { id: 'security', icon: AlertTriangle, label: 'Security & Attendance' },
    { id: 'reports', icon: BarChart3, label: 'Reports & Analytics' },
    { id: 'admin', icon: Settings, label: 'Admin Controls' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <WardenProfile user={user} />;
      case 'complaints':
        return (
          <WardenComplaints 
            complaints={complaints} 
            setComplaints={setComplaints}
            housekeepingMessages={housekeepingMessages}
            setHousekeepingMessages={setHousekeepingMessages}
          />
        );
      case 'notices':
        return <WardenNotices notices={notices} setNotices={setNotices} user={user} />;
      case 'security':
        return (
          <WardenSecurity 
            securityAlerts={securityAlerts} 
            setSecurityAlerts={setSecurityAlerts}
          />
        );
      case 'reports':
        return <WardenReports complaints={complaints} />;
      case 'admin':
        return <WardenAdmin />;
      default:
        return <DashboardOverview />;
    }
  };

  const DashboardOverview = () => {
    const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
    const inProgressComplaints = complaints.filter(c => c.status === 'in-progress').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
    const pendingAlerts = securityAlerts.filter(a => a.status === 'pending').length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user.name}
          </h1>
          <div className="text-sm text-gray-600">
            {user.designation} • {user.department}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <MessageSquare className="w-6 h-6 text-red-600" />
              <h3 className="font-semibold text-red-800">Pending</h3>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-1">{pendingComplaints}</div>
            <div className="text-sm text-red-700">Complaints</div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">In Progress</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600 mb-1">{inProgressComplaints}</div>
            <div className="text-sm text-yellow-700">Complaints</div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-800">Resolved</h3>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">{resolvedComplaints}</div>
            <div className="text-sm text-green-700">Complaints</div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Security</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{pendingAlerts}</div>
            <div className="text-sm text-purple-700">Active alerts</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Complaints</h3>
            <div className="space-y-3">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{complaint.category}</div>
                    <div className="text-sm text-gray-600">Room {complaint.roomNumber} • {complaint.studentName}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Security Alerts</h3>
            <div className="space-y-3">
              {securityAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{alert.type.replace('_', ' ').toUpperCase()}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{alert.studentName} • {alert.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-green-600">Warden Portal</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-600">{user.designation}</div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {activeTab === 'dashboard' ? <DashboardOverview /> : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default WardenDashboard;