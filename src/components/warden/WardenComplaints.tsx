import React, { useState } from 'react';
import { MessageSquare, Filter, Calendar, User, Settings, AlertTriangle } from 'lucide-react';
import { Complaint } from '../../App';

interface WardenComplaintsProps {
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
  housekeepingMessages: any[];
  setHousekeepingMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

const staffMembers = [
  'Mike Johnson (Maintenance)',
  'Sarah Wilson (Housekeeping)',
  'John Brown (Electrical)',
  'Lisa Davis (Plumbing)',
  'David Smith (Security)'
];

const WardenComplaints: React.FC<WardenComplaintsProps> = ({
  complaints,
  setComplaints,
  housekeepingMessages,
  setHousekeepingMessages
}) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['all', 'Housekeeping', 'Electricity', 'Plumbing', 'Mess', 'Wi-Fi', 'Security'];

  const filteredComplaints = complaints
    .filter(complaint => {
      const categoryMatch = filterCategory === 'all' || complaint.category === filterCategory;
      const statusMatch = filterStatus === 'all' || complaint.status === filterStatus;
      return categoryMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    setComplaints(prev => 
      prev.map(complaint => {
        if (complaint.id === complaintId) {
          const updatedComplaint = { 
            ...complaint, 
            status: newStatus as any,
            resolvedAt: newStatus === 'resolved' ? new Date() : complaint.resolvedAt
          };
          
          // Send message to housekeeping when status changes to in-progress
          if (newStatus === 'in-progress' && complaint.status !== 'in-progress') {
            const message = {
              id: Date.now().toString(),
              complaintId,
              roomNumber: complaint.roomNumber,
              category: complaint.category,
              description: complaint.description,
              studentName: complaint.studentName,
              timestamp: new Date()
            };
            setHousekeepingMessages(prev => [...prev, message]);
            alert('Work order sent to housekeeping team!');
          }
          
          return updatedComplaint;
        }
        return complaint;
      })
    );
  };

  const handleAssignTo = (complaintId: string, assignedTo: string) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId ? { ...complaint, assignedTo } : complaint
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryStats = () => {
    const stats = categories.slice(1).map(category => ({
      category,
      total: complaints.filter(c => c.category === category).length,
      pending: complaints.filter(c => c.category === category && c.status === 'pending').length,
      resolved: complaints.filter(c => c.category === category && c.status === 'resolved').length
    }));
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <MessageSquare className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Complaint Management</h1>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Complaints</h3>
          <div className="text-3xl font-bold text-blue-600">{complaints.length}</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending</h3>
          <div className="text-3xl font-bold text-red-600">
            {complaints.filter(c => c.status === 'pending').length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">In Progress</h3>
          <div className="text-3xl font-bold text-yellow-600">
            {complaints.filter(c => c.status === 'in-progress').length}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resolution Rate</h3>
          <div className="text-3xl font-bold text-green-600">
            {complaints.length > 0 ? Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Priority Complaints Alert */}
      {complaints.filter(c => c.status === 'pending').length > 5 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="text-red-800 font-semibold">High Priority Alert</h4>
              <p className="text-red-700 text-sm">
                You have {complaints.filter(c => c.status === 'pending').length} pending complaints that need attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{complaint.category}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{complaint.studentName} • Room {complaint.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Settings className="w-4 h-4" />
                    <span>{complaint.assignedTo || 'Unassigned'}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{complaint.description}</p>

                {complaint.image && (
                  <img 
                    src={complaint.image} 
                    alt="Complaint evidence"
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Assign to:</label>
                <select
                  value={complaint.assignedTo || ''}
                  onChange={(e) => handleAssignTo(complaint.id, e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select Staff</option>
                  {staffMembers.map(staff => (
                    <option key={staff} value={staff}>{staff}</option>
                  ))}
                </select>
              </div>
            </div>

            {complaint.rating && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-green-800">Student Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= complaint.rating! ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {complaint.feedback && (
                  <p className="text-sm text-green-700">"{complaint.feedback}"</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Complaints Found</h3>
          <p className="text-gray-500">No complaints match the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default WardenComplaints;