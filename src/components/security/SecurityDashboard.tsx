import React, { useState } from 'react';
import { 
  UserCheck, Users, Clock, AlertTriangle, CheckCircle, 
  Search, Calendar, LogOut, Menu, X, Home, Eye, MessageSquare, Plus, Upload
} from 'lucide-react';
import { User as UserType, SecurityAlert } from '../../App';

interface SecurityDashboardProps {
  user: UserType;
  securityAlerts: SecurityAlert[];
  setSecurityAlerts: React.Dispatch<React.SetStateAction<SecurityAlert[]>>;
  onLogout: () => void;
}

const mockAttendanceData = [
  { id: '1', studentName: 'John Doe', roomNumber: 'A-101', entryTime: '18:30', exitTime: '19:45', date: '2025-01-15', status: 'on_time' },
  { id: '2', studentName: 'Jane Smith', roomNumber: 'B-203', entryTime: '23:45', exitTime: null, date: '2025-01-15', status: 'late_entry' },
  { id: '3', studentName: 'Mike Johnson', roomNumber: 'A-205', entryTime: '22:15', exitTime: '23:30', date: '2025-01-15', status: 'on_time' },
  { id: '4', studentName: 'Sarah Wilson', roomNumber: 'B-104', entryTime: '20:00', exitTime: null, date: '2025-01-15', status: 'curfew_violation' }
];

const mockVisitorData = [
  { id: '1', visitorName: 'Robert Doe', studentName: 'John Doe', roomNumber: 'A-101', purpose: 'Family Visit', inTime: '14:30', outTime: '17:00', date: '2025-01-15' },
  { id: '2', visitorName: 'Mary Smith', studentName: 'Jane Smith', roomNumber: 'B-203', purpose: 'Friend', inTime: '16:00', outTime: '19:30', date: '2025-01-15' },
  { id: '3', visitorName: 'David Brown', studentName: 'Mike Johnson', roomNumber: 'A-205', purpose: 'Relative', inTime: '10:00', outTime: '18:00', date: '2025-01-15' }
];

const mockOutpassData = [
  { id: '1', studentName: 'John Doe', roomNumber: 'A-101', outpassType: 'day', parentApproval: true, outTime: '09:00', returnTime: '18:30', expectedReturn: '20:00', date: '2025-01-15', status: 'on_time', purpose: 'Medical appointment' },
  { id: '2', studentName: 'Jane Smith', roomNumber: 'B-203', outpassType: 'night', parentApproval: true, outTime: '19:00', returnTime: null, expectedReturn: '23:00', date: '2025-01-15', status: 'not_returned', purpose: 'Family function' },
  { id: '3', studentName: 'Mike Johnson', roomNumber: 'A-205', outpassType: 'long', parentApproval: true, outTime: '08:00', returnTime: '23:45', expectedReturn: '22:00', date: '2025-01-14', status: 'late_return', purpose: 'Home visit' }
];

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  user,
  securityAlerts,
  setSecurityAlerts,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [outpassData, setOutpassData] = useState(mockOutpassData);
  const [showOutpassForm, setShowOutpassForm] = useState(false);
  const [newOutpass, setNewOutpass] = useState({
    studentName: '',
    roomNumber: '',
    outpassType: 'day',
    parentApproval: false,
    outTime: '',
    expectedReturn: '',
    purpose: '',
    image: null as File | null
  });
  const [editingOutpass, setEditingOutpass] = useState<string | null>(null);
  const [returnStatus, setReturnStatus] = useState('on_time');

  const handleResolveAlert = (alertId: string) => {
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved', resolvedAt: new Date() }
          : alert
      )
    );
    alert('Security alert marked as resolved!');
  };

  const filteredAlerts = securityAlerts.filter(alert => {
    const matchesSearch = alert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || new Date(alert.createdAt).toISOString().split('T')[0] === filterDate;
    return matchesSearch && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getAttendanceStatusColor = (status: string) => {
    switch (status) {
      case 'on_time':
        return 'bg-green-100 text-green-800';
      case 'late_entry':
        return 'bg-yellow-100 text-yellow-800';
      case 'curfew_violation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'alerts', icon: AlertTriangle, label: 'Security Alerts' },
    { id: 'attendance', icon: Users, label: 'Student Attendance' },
    { id: 'visitors', icon: Eye, label: 'Visitor Management' },
    { id: 'outpass', icon: Calendar, label: 'Outpass Management' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'alerts':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Security Alerts & Investigations</h2>
            
            {filteredAlerts.filter(alert => alert.status === 'investigating').map((alert) => (
              <div key={alert.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-1">
                        Student: <span className="font-medium text-gray-800">{alert.studentName}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Description: <span className="text-gray-800">{alert.description}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Investigation Started: {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.filter(alert => alert.status === 'resolved').map((alert) => (
              <div key={alert.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        RESOLVED
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-1">
                        Student: <span className="font-medium text-gray-800">{alert.studentName}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Description: <span className="text-gray-800">{alert.description}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Resolved: {alert.resolvedAt && new Date(alert.resolvedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredAlerts.filter(alert => alert.status === 'investigating').length === 0 && 
             filteredAlerts.filter(alert => alert.status === 'resolved').length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No Active Investigations</h3>
                <p className="text-gray-500">No security alerts require your attention at this time.</p>
              </div>
            )}
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Student Entry/Exit Logs</h2>
            
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Entry Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Exit Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendanceData.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-800">{record.studentName}</td>
                      <td className="py-3 px-4 text-gray-600">{record.roomNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{record.entryTime}</td>
                      <td className="py-3 px-4 text-gray-600">{record.exitTime || 'Not exited'}</td>
                      <td className="py-3 px-4 text-gray-600">{record.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'visitors':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Visitor Management</h2>
            
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Visitor Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Visiting Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">In Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Out Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVisitorData.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-800">{visitor.visitorName}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.studentName}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.roomNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.purpose}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.inTime}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.outTime || 'Not checked out'}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          visitor.outTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {visitor.outTime ? 'CHECKED OUT' : 'NOT CHECKED OUT'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <h2 className="text-xl font-bold text-purple-600">Security Portal</h2>
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
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
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
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Information Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">i</span>
              </div>
              <div>
                <h4 className="text-blue-800 font-semibold mb-2">Security Officer Responsibilities</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  <p>• <strong>Entry/Exit Logs:</strong> Record student entry and exit times manually or via QR scanner</p>
                  <p>• <strong>Status Classification:</strong> Mark as "On Time" (before 10 PM), "Late Entry" (10-11 PM), or "Curfew Violation" (after 11 PM)</p>
                  <p>• <strong>Visitor Management:</strong> Register visitors on entry and mark checkout times when they leave</p>
                  <p>• <strong>Investigation Alerts:</strong> Receive investigation requests from Warden and mark as resolved when completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-64">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default SecurityDashboard;