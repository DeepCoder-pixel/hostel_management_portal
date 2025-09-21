import React, { useState } from 'react';
import { 
  User, MessageSquare, Bell, Calendar, AlertTriangle, 
  FileText, LogOut, Menu, X, Home
} from 'lucide-react';
import StudentProfile from './StudentProfile';
import StudentComplaints from './StudentComplaints';
import StudentNotices from './StudentNotices';
import StudentEvents from './StudentEvents';
import StudentEmergency from './StudentEmergency';
import StudentReports from './StudentReports';
import { User as UserType, Complaint, Notice, Event, ChatMessage } from '../../App';

interface StudentDashboardProps {
  user: UserType;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  notices: Notice[];
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  complaints,
  setComplaints,
  notices,
  events,
  setEvents,
  chatMessages,
  setChatMessages,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'complaints', icon: MessageSquare, label: 'Complaints' },
    { id: 'notices', icon: Bell, label: 'Notice Board' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency' },
    { id: 'reports', icon: FileText, label: 'Reports' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <StudentProfile user={user} />;
      case 'complaints':
        return <StudentComplaints user={user} complaints={complaints} setComplaints={setComplaints} />;
      case 'notices':
        return <StudentNotices notices={notices} />;
      case 'events':
        return (
          <StudentEvents 
            user={user}
            events={events}
            setEvents={setEvents}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        );
      case 'emergency':
        return <StudentEmergency user={user} />;
      case 'reports':
        return <StudentReports user={user} complaints={complaints} />;
      default:
        return <StudentDashboard />;
    }
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user.name}!
        </h1>
        <div className="text-sm text-gray-600">
          Room: {user.roomNumber}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Complaints</h3>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {complaints.filter(c => c.studentId === user.id).length}
          </div>
          <div className="text-sm text-blue-700">Total lodged</div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-green-800">Notices</h3>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {notices.length}
          </div>
          <div className="text-sm text-green-700">Active notices</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Events</h3>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {events.length}
          </div>
          <div className="text-sm text-purple-700">Upcoming events</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Complaints</h3>
          <div className="space-y-3">
            {complaints
              .filter(c => c.studentId === user.id)
              .slice(0, 3)
              .map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{complaint.category}</div>
                    <div className="text-sm text-gray-600 truncate">{complaint.description}</div>
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
          <h3 className="text-lg font-semibold mb-4">Latest Notices</h3>
          <div className="space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800">{notice.title}</div>
                <div className="text-sm text-gray-600 truncate">{notice.content}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

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
          <h2 className="text-xl font-bold text-blue-600">Student Portal</h2>
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
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
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
                <div className="text-sm text-gray-600">Room {user.roomNumber}</div>
              </div>
              {user.photo && (
                <img 
                  src={user.photo} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
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

export default StudentDashboard;