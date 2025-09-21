import React, { useState } from 'react';
import { Bell, Plus, Calendar, Edit, Trash, Filter } from 'lucide-react';
import { Notice, User } from '../../App';

interface WardenNoticesProps {
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  user: User;
}

const categories = ['general', 'mess', 'maintenance', 'events', 'emergency'];

const WardenNotices: React.FC<WardenNoticesProps> = ({ notices, setNotices, user }) => {
  const [showNewNotice, setShowNewNotice] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'general',
    expiryDate: ''
  });

  const handleSubmitNotice = (e: React.FormEvent) => {
    e.preventDefault();
    
    const notice: Notice = {
      id: Date.now().toString(),
      title: newNotice.title,
      content: newNotice.content,
      category: newNotice.category,
      createdBy: user.name,
      createdAt: new Date(),
      expiryDate: newNotice.expiryDate ? new Date(newNotice.expiryDate) : undefined
    };

    setNotices(prev => [...prev, notice]);
    resetForm();
  };

  const handleEditNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    setNotices(prev => 
      prev.map(notice => 
        notice.id === editingNotice.id 
          ? { 
              ...notice, 
              title: newNotice.title, 
              content: newNotice.content, 
              category: newNotice.category,
              expiryDate: newNotice.expiryDate ? new Date(newNotice.expiryDate) : undefined
            }
          : notice
      )
    );
    resetForm();
  };

  const handleDeleteNotice = (noticeId: string) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(prev => prev.filter(notice => notice.id !== noticeId));
    }
  };

  const startEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setNewNotice({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      expiryDate: notice.expiryDate ? notice.expiryDate.toISOString().split('T')[0] : ''
    });
    setShowNewNotice(true);
  };

  const resetForm = () => {
    setNewNotice({ title: '', content: '', category: 'general', expiryDate: '' });
    setEditingNotice(null);
    setShowNewNotice(false);
  };

  const filteredNotices = notices.filter(notice => 
    filterCategory === 'all' || notice.category === filterCategory
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Bell className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Notice Management</h1>
        </div>
        <button
          onClick={() => setShowNewNotice(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Notice
        </button>
      </div>

      {/* New/Edit Notice Modal */}
      {showNewNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6">
              {editingNotice ? 'Edit Notice' : 'Create New Notice'}
            </h3>
            
            <form onSubmit={editingNotice ? handleEditNotice : handleSubmitNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter notice title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newNotice.category}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={6}
                  placeholder="Enter notice content..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={newNotice.expiryDate}
                  onChange={(e) => setNewNotice(prev => ({ ...prev, expiryDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  {editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by category:</span>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div key={notice.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(notice.category)}`}>
                    {notice.category.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{notice.content}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created: {new Date(notice.createdAt).toLocaleDateString()}
                  </div>
                  {notice.expiryDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                  <div>By: {notice.createdBy}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(notice)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Notice"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteNotice(notice.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Notice"
                >
                  <Trash className="w-5 h-5" />
                </button>
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
            {filterCategory === 'all' 
              ? 'Click "Create Notice" to post your first notice.'
              : `No notices found in the ${filterCategory} category.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default WardenNotices;