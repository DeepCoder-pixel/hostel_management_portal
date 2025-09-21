import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Complaint } from '../../App';

interface WardenReportsProps {
  complaints: Complaint[];
}

const WardenReports: React.FC<WardenReportsProps> = ({ complaints }) => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  const getComplaintStats = () => {
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    
    const categoryStats = complaints.reduce((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgResolutionTime = resolved > 0 ? '2.5 hours' : 'N/A';
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      total,
      resolved,
      pending,
      inProgress,
      categoryStats,
      avgResolutionTime,
      resolutionRate
    };
  };

  const getMonthlyTrends = () => {
    // Mock monthly data for demonstration
    return [
      { month: 'Jan', complaints: 45, resolved: 40 },
      { month: 'Feb', complaints: 52, resolved: 48 },
      { month: 'Mar', complaints: 38, resolved: 35 },
      { month: 'Apr', complaints: 41, resolved: 39 },
      { month: 'May', complaints: 47, resolved: 44 }
    ];
  };

  const handleExportReport = (type: string) => {
    const stats = getComplaintStats();
    let csvContent = '';

    if (type === 'overview') {
      csvContent = [
        ['Metric', 'Value'],
        ['Total Complaints', stats.total],
        ['Resolved', stats.resolved],
        ['Pending', stats.pending],
        ['In Progress', stats.inProgress],
        ['Resolution Rate', `${stats.resolutionRate}%`],
        ['Average Resolution Time', stats.avgResolutionTime]
      ].map(row => row.join(',')).join('\n');
    } else if (type === 'detailed') {
      csvContent = [
        ['Date', 'Student', 'Room', 'Category', 'Description', 'Status', 'Assigned To', 'Rating'].join(','),
        ...complaints.map(complaint => [
          new Date(complaint.createdAt).toLocaleDateString(),
          complaint.studentName,
          complaint.roomNumber,
          complaint.category,
          `"${complaint.description}"`,
          complaint.status,
          complaint.assignedTo || 'Unassigned',
          complaint.rating || 'N/A'
        ].join(','))
      ].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const stats = getComplaintStats();
  const trends = getMonthlyTrends();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
      </div>

      {/* Export Controls */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Overview Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="performance">Staff Performance</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleExportReport('overview')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Overview
            </button>
            <button
              onClick={() => handleExportReport('detailed')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Total Complaints</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500 mt-1">All time</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Resolution Rate</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.resolutionRate}%</div>
          <div className="text-sm text-gray-500 mt-1">
            {stats.resolved} of {stats.total} resolved
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Avg. Resolution</h3>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.avgResolutionTime}</div>
          <div className="text-sm text-gray-500 mt-1">Response time</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-600">Active Cases</h3>
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.pending + stats.inProgress}</div>
          <div className="text-sm text-gray-500 mt-1">Needs attention</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Complaints by Category</h3>
          <div className="space-y-4">
            {Object.entries(stats.categoryStats).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-700">{category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-800 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Trends</h3>
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.month} className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{trend.month}</span>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="text-blue-600 font-medium">{trend.complaints}</span> total
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="text-green-600 font-medium">{trend.resolved}</span> resolved
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Current Status Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="w-24 h-24 rounded-full border-8 border-red-200"></div>
              <div 
                className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-red-500"
                style={{ 
                  transform: 'rotate(-90deg)',
                  background: `conic-gradient(#ef4444 ${(stats.pending / stats.total) * 360}deg, transparent 0deg)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-red-600">{stats.pending}</span>
              </div>
            </div>
            <h4 className="font-semibold text-red-600">Pending</h4>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="w-24 h-24 rounded-full border-8 border-yellow-200"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-yellow-600">{stats.inProgress}</span>
              </div>
            </div>
            <h4 className="font-semibold text-yellow-600">In Progress</h4>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="w-24 h-24 rounded-full border-8 border-green-200"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-green-600">{stats.resolved}</span>
              </div>
            </div>
            <h4 className="font-semibold text-green-600">Resolved</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenReports;