import React, { useState } from 'react';
import { FileText, Calendar, Filter, Download, BarChart3 } from 'lucide-react';
import { User, Complaint } from '../../App';

interface StudentReportsProps {
  user: User;
  complaints: Complaint[];
}

const StudentReports: React.FC<StudentReportsProps> = ({ user, complaints }) => {
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const userComplaints = complaints.filter(c => c.studentId === user.id);

  const filteredComplaints = userComplaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status === statusFilter;
    
    if (dateRange === 'all') return statusMatch;
    
    const complaintDate = new Date(complaint.createdAt);
    const now = new Date();
    
    switch (dateRange) {
      case 'week':
        return statusMatch && complaintDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return statusMatch && complaintDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '3months':
        return statusMatch && complaintDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return statusMatch;
    }
  });

  const getStats = () => {
    const total = userComplaints.length;
    const resolved = userComplaints.filter(c => c.status === 'resolved').length;
    const pending = userComplaints.filter(c => c.status === 'pending').length;
    const inProgress = userComplaints.filter(c => c.status === 'in-progress').length;
    
    const resolvedWithRating = userComplaints.filter(c => c.status === 'resolved' && c.rating).length;
    const avgRating = resolvedWithRating > 0 
      ? userComplaints
          .filter(c => c.status === 'resolved' && c.rating)
          .reduce((sum, c) => sum + (c.rating || 0), 0) / resolvedWithRating
      : 0;

    return { total, resolved, pending, inProgress, avgRating };
  };

  const handleExportData = () => {
    const csvContent = [
      ['Date', 'Category', 'Description', 'Status', 'Assigned To', 'Rating'].join(','),
      ...filteredComplaints.map(complaint => [
        new Date(complaint.createdAt).toLocaleDateString(),
        complaint.category,
        `"${complaint.description}"`,
        complaint.status,
        complaint.assignedTo || 'Unassigned',
        complaint.rating || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaints-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <FileText className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Total Complaints</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-500">
            {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% resolution rate
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Avg Rating</h3>
            <div className="text-yellow-400">★</div>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
          </div>
        </div>
      </div>

      {/* Filters and Export */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="3months">Last 3 Months</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <button
            onClick={handleExportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Complaints Timeline */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Complaints History</h3>

        <div className="space-y-4">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{complaint.category}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {complaint.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{complaint.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Created: {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                      {complaint.resolvedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                        </div>
                      )}
                      {complaint.assignedTo && (
                        <div>Assigned to: {complaint.assignedTo}</div>
                      )}
                    </div>

                    {complaint.rating && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Your Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= complaint.rating! ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {complaint.feedback && (
                          <span className="text-sm text-gray-600 ml-2">
                            "{complaint.feedback}"
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {complaint.image && (
                    <img 
                      src={complaint.image} 
                      alt="Complaint evidence"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Data Found</h3>
              <p className="text-gray-500">No complaints found for the selected filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReports;