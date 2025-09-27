import React, { useState } from 'react';
import { 
  UserCheck, Users, Clock, AlertTriangle, CheckCircle, 
  Search, Calendar, LogOut, Menu, X, Home, Eye, MessageSquare, Plus, Download
} from 'lucide-react';
import { User as UserType, SecurityAlert } from '../../App';

interface SecurityDashboardProps {
  user: UserType;
  securityAlerts: SecurityAlert[];
  setSecurityAlerts: React.Dispatch<React.SetStateAction<SecurityAlert[]>>;
  onLogout: () => void;
}

const mockAttendanceData = [
  { id: '1', studentName: 'Alice Johnson', roomNumber: 'A-201', entryTime: '08:30 AM', exitTime: null, date: '2025-01-15', status: 'in', duration: 'Ongoing' },
  { id: '2', studentName: 'Bob Smith', roomNumber: 'B-105', entryTime: '07:45 AM', exitTime: '09:15 PM', date: '2025-01-15', status: 'out', duration: '13h 45m' },
  { id: '3', studentName: 'Mike Johnson', roomNumber: 'A-205', entryTime: '22:15', exitTime: '23:30', date: '2025-01-15', status: 'on_time', duration: '1h 15m' },
  { id: '4', studentName: 'Sarah Wilson', roomNumber: 'B-104', entryTime: '20:00', exitTime: null, date: '2025-01-15', status: 'curfew_violation', duration: 'Ongoing' }
];

const mockVisitorData = [
  { id: '1', visitorName: 'Alice Johnson', studentName: 'John Doe', roomNumber: 'A-201', purpose: 'Parent Visit', inTime: '02:00 PM', outTime: null, date: '2025-01-15', contactNumber: '+91-XXX-XXX-1234', idProof: 'Aadhar Card' },
  { id: '2', visitorName: 'Bob Smith', studentName: 'Jane Smith', roomNumber: 'B-105', purpose: 'Family Visit', inTime: '10:00 AM', outTime: '03:00 PM', date: '2025-01-15', contactNumber: '+91-XXX-XXX-5678', idProof: 'Driving License' },
  { id: '3', visitorName: 'Mary Smith', studentName: 'Mike Johnson', roomNumber: 'A-205', purpose: 'Friend', inTime: '16:00', outTime: '19:30', date: '2025-01-15', contactNumber: '+91-XXX-XXX-9012', idProof: 'PAN Card' }
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
  const [showRegisterVisitor, setShowRegisterVisitor] = useState(false);
  const [showResolveAlert, setShowResolveAlert] = useState<string | null>(null);
  const [visitorData, setVisitorData] = useState(mockVisitorData);
  const [newVisitor, setNewVisitor] = useState({
    visitorName: '',
    studentName: '',
    roomNumber: '',
    contactNumber: '',
    purpose: 'Parent Visit',
    idProof: 'Aadhar Card'
  });
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleResolveAlert = (alertId: string) => {
    if (!resolutionNotes.trim()) {
      alert('Please add resolution notes before marking as resolved.');
      return;
    }
    
    setSecurityAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' as any, resolvedAt: new Date() }
          : alert
      )
    );
    setShowResolveAlert(null);
    setResolutionNotes('');
    alert('Security alert resolved successfully!');
  };

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVisitor.visitorName.trim() || !newVisitor.studentName.trim() || 
        !newVisitor.roomNumber.trim() || !newVisitor.contactNumber.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const visitor = {
      id: Date.now().toString(),
      ...newVisitor,
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outTime: null,
      date: new Date().toISOString().split('T')[0]
    };
    setVisitorData(prev => [...prev, visitor]);
    setNewVisitor({
      visitorName: '',
      studentName: '',
      roomNumber: '',
      contactNumber: '',
      purpose: 'Parent Visit',
      idProof: 'Aadhar Card'
    });
    setShowRegisterVisitor(false);
    alert('Visitor registered successfully!');
  };

  const handleCheckOut = (visitorId: string) => {
    setVisitorData(prev => 
      prev.map(visitor => 
        visitor.id === visitorId 
          ? { ...visitor, outTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : visitor
      )
    );
    alert('Visitor checked out successfully!');
  };

  const handleDownloadReport = () => {
    const csvContent = [
      ['Student', 'Room', 'Entry Time', 'Exit Time', 'Status', 'Duration', 'Date'].join(','),
      ...mockAttendanceData.map(record => [
        record.studentName,
        record.roomNumber,
        record.entryTime,
        record.exitTime || 'Not exited',
        record.status,
        record.duration || 'N/A',
        record.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      case 'in':
        return 'bg-green-100 text-green-800';
      case 'out':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_time':
        return 'bg-blue-100 text-blue-800';
      case 'curfew_violation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'alerts', icon: AlertTriangle, label: 'Security Alerts' },
    { id: 'attendance', icon: Users, label: 'Student Attendance' },
    { id: 'visitors', icon: Eye, label: 'Visitor Management' }
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
                      onClick={() => setShowResolveAlert(alert.id)}
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Attendance Logs</h2>
                <p className="text-gray-600">Monitor student entry and exit records</p>
              </div>
              <button
                onClick={handleDownloadReport}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">Students Present</h3>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">3</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Students Out</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">2</div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-red-800">Late Returns</h3>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">1</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Total Records</h3>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Today</option>
                <option>Yesterday</option>
                <option>This Week</option>
              </select>
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>Present</option>
                <option>Out</option>
                <option>Late Returns</option>
              </select>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Entry Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Exit Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendanceData.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-red-500" />
                          <span className="font-medium text-gray-800">{record.studentName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{record.roomNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{record.entryTime}</td>
                      <td className="py-3 px-4 text-gray-600">{record.exitTime || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                          {record.status === 'in' ? 'In' : record.status === 'out' ? 'Out' : record.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{record.duration}</td>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Visitor Management</h2>
                <p className="text-gray-600">Track and manage hostel visitors</p>
              </div>
              <button
                onClick={() => setShowRegisterVisitor(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Register Visitor
              </button>
            </div>

            {/* Visitor Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">Active Visitors</h3>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {visitorData.filter(v => !v.outTime).length}
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Exited Today</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {visitorData.filter(v => v.outTime).length}
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h3 className="font-semibold text-red-800">Overstay Alerts</h3>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-1">1</div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Total Visitors</h3>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{visitorData.length}</div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4 mb-6">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Visitors</option>
                <option>Active Visitors</option>
                <option>Checked Out</option>
              </select>
            </div>
            
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Visiting</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Purpose</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Entry Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Exit Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorData.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{visitor.visitorName}</div>
                        <div className="text-sm text-gray-600">Room {visitor.roomNumber}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{visitor.purpose}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.inTime}</td>
                      <td className="py-3 px-4 text-gray-600">{visitor.outTime || '-'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-700">
                            {visitor.outTime ? 'Exited' : 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {!visitor.outTime && (
                          <button
                            onClick={() => handleCheckOut(visitor.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Check Out
                          </button>
                        )}
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