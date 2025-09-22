import React, { useState } from 'react';
import { AlertTriangle, Users, Clock, Search, Calendar, Eye } from 'lucide-react';
import { SecurityAlert } from '../../App';

interface WardenSecurityProps {
  securityAlerts: SecurityAlert[];
  setSecurityAlerts: React.Dispatch<React.SetStateAction<SecurityAlert[]>>;
}

const mockAttendanceData = [
  { id: '1', studentName: 'John Doe', roomNumber: 'A-101', entryTime: '18:30', exitTime: '19:45', date: '2025-01-15', status: 'on_time' },
  { id: '2', studentName: 'Jane Smith', roomNumber: 'B-203', entryTime: '23:45', exitTime: null, date: '2025-01-15', status: 'late_entry' },
  { id: '3', studentName: 'Mike Johnson', roomNumber: 'A-205', entryTime: '22:15', exitTime: '23:30', date: '2025-01-15', status: 'on_time' },
  { id: '4', studentName: 'Sarah Wilson', roomNumber: 'B-104', entryTime: '20:00', exitTime: null, date: '2025-01-15', status: 'curfew_violation' }
];

const mockVisitorData = [
  { id: '1', visitorName: 'Robert Doe', studentName: 'John Doe', roomNumber: 'A-101', purpose: 'Family Visit', inTime: '14:30', outTime: '17:00', date: '2025-01-15' },
  { id: '2', visitorName: 'Mary Smith', studentName: 'Jane Smith', roomNumber: 'B-203', purpose: 'Friend', inTime: '16:00', outTime: null, date: '2025-01-15' }
];

const WardenSecurity: React.FC<WardenSecurityProps> = ({
  securityAlerts,
  setSecurityAlerts
}) => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handleInvestigate = (alertId: string) => {
    const alert = securityAlerts.find(a => a.id === alertId);
    if (alert) {
      setSecurityAlerts(prev => 
        prev.map(a => 
          a.id === alertId ? { ...a, status: 'investigating' } : a
        )
      );

      // This would send a message to security portal in a real app
      alert(`Investigation request sent to security team for: ${alert.studentName} - ${alert.description}`);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <AlertTriangle className="w-8 h-8 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Security & Attendance</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Security Alerts
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'attendance'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Student Entry/Exit
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'visitors'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Visitor Management
          </button>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4 mb-6">
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

          {/* Content based on active tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
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
                          Time: {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>

                      {alert.status === 'pending' && (
                        <button
                          onClick={() => handleInvestigate(alert.id)}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Send to Security Team
                        </button>
                      )}

                      {alert.status === 'investigating' && (
                        <div className="text-sm text-yellow-600 font-medium">
                          Investigation in progress by security team...
                        </div>
                      )}

                      {alert.resolvedAt && (
                        <div className="mt-2 text-sm text-green-600">
                          Resolved: {new Date(alert.resolvedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Security Alerts</h3>
                  <p className="text-gray-500">No security alerts found for the selected criteria.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 font-medium text-gray-700">Room</th>
                    <th className="text-left py-3 font-medium text-gray-700">Entry Time</th>
                    <th className="text-left py-3 font-medium text-gray-700">Exit Time</th>
                    <th className="text-left py-3 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendanceData.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-800">{record.studentName}</td>
                      <td className="py-3 text-gray-600">{record.roomNumber}</td>
                      <td className="py-3 text-gray-600">{record.entryTime}</td>
                      <td className="py-3 text-gray-600">{record.exitTime || 'Not exited'}</td>
                      <td className="py-3 text-gray-600">{record.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'visitors' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-700">Visitor Name</th>
                    <th className="text-left py-3 font-medium text-gray-700">Visiting Student</th>
                    <th className="text-left py-3 font-medium text-gray-700">Room</th>
                    <th className="text-left py-3 font-medium text-gray-700">Purpose</th>
                    <th className="text-left py-3 font-medium text-gray-700">In Time</th>
                    <th className="text-left py-3 font-medium text-gray-700">Out Time</th>
                    <th className="text-left py-3 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockVisitorData.map((visitor) => (
                    <tr key={visitor.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-800">{visitor.visitorName}</td>
                      <td className="py-3 text-gray-600">{visitor.studentName}</td>
                      <td className="py-3 text-gray-600">{visitor.roomNumber}</td>
                      <td className="py-3 text-gray-600">{visitor.purpose}</td>
                      <td className="py-3 text-gray-600">{visitor.inTime}</td>
                      <td className="py-3 text-gray-600">{visitor.outTime || 'Not checked out'}</td>
                      <td className="py-3 text-gray-600">{visitor.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardenSecurity;