import React, { useState } from 'react';
import { Bell, Calendar, Filter, ChevronDown } from 'lucide-react';
import { Notice } from '../../App';

interface StudentNoticesProps {
  notices: Notice[];
}

const StudentNotices: React.FC<StudentNoticesProps> = ({ notices }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['all', 'mess', 'maintenance', 'events', 'general', 'emergency'];

  const filteredNotices = notices
    .filter(notice => filterCategory === 'all' || notice.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const getCategoryColor = (category: string) => {
    const colors = {
      mess: 'bg-green-100 text-green-800',
      maintenance: 'bg-orange-100 text-orange-800',
      events: 'bg-purple-100 text-purple-800',
      general: 'bg-blue-100 text-blue-800',
      emergency: 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (category: string) => {
    if (category === 'emergency') {
      return <span className="text-red-500 text-lg">🚨</span>;
    }
    if (category === 'events') {
      return <span className="text-purple-500 text-lg">🎉</span>;
    }
    return <Bell className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Bell className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div 
            key={notice.id} 
            className={`bg-white rounded-xl shadow-sm border-l-4 p-6 ${
              notice.category === 'emergency' ? 'border-l-red-500 bg-red-50' :
              notice.category === 'events' ? 'border-l-purple-500' :
              'border-l-blue-500'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {getPriorityIcon(notice.category)}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                      {notice.category.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">{notice.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted: {new Date(notice.createdAt).toLocaleDateString()}
                    </div>
                    {notice.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      By: {notice.createdBy}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotices.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Notices Found</h3>
          <p className="text-gray-500">
            {filterCategory === 'all' ? 'No notices available at the moment.' : `No notices found in the ${filterCategory} category.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentNotices;