import React, { useState } from 'react';
import { MessageSquare, Plus, Camera, Star, Clock, CheckCircle } from 'lucide-react';
import { User, Complaint } from '../../App';

interface StudentComplaintsProps {
  user: User;
  complaints: Complaint[];
  setComplaints: React.Dispatch<React.SetStateAction<Complaint[]>>;
}

const categories = [
  'Housekeeping', 'Electricity', 'Plumbing', 'Mess', 'Wi-Fi', 'Security', 'Other'
];

const StudentComplaints: React.FC<StudentComplaintsProps> = ({
  user,
  complaints,
  setComplaints
}) => {
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    category: '',
    description: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const userComplaints = complaints.filter(c => c.studentId === user.id);

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    
    const complaint: Complaint = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      roomNumber: user.roomNumber || '',
      category: newComplaint.category,
      description: newComplaint.description,
      status: 'pending',
      assignedTo: '',
      createdAt: new Date(),
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined
    };

    setComplaints(prev => [...prev, complaint]);
    setNewComplaint({ category: '', description: '', image: '' });
    setSelectedImage(null);
    setShowNewComplaint(false);
  };

  const handleRatingSubmit = (complaintId: string) => {
    setComplaints(prev => 
      prev.map(c => 
        c.id === complaintId 
          ? { ...c, rating, feedback }
          : c
      )
    );
    setShowRatingModal(null);
    setRating(0);
    setFeedback('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
        </div>
        <button
          onClick={() => setShowNewComplaint(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Complaint
        </button>
      </div>

      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-6">Lodge New Complaint</h3>
            
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Image (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Camera className="w-5 h-5" />
                    Choose Image
                  </label>
                  {selectedImage && (
                    <span className="text-sm text-green-600">{selectedImage.name}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewComplaint(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {userComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(complaint.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {complaint.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{complaint.category}</h3>
              <p className="text-gray-600 text-sm">{complaint.description}</p>
            </div>

            {complaint.image && (
              <div className="mb-4">
                <img 
                  src={complaint.image} 
                  alt="Complaint evidence"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {complaint.assignedTo && (
              <div className="mb-4 text-sm">
                <span className="text-gray-600">Assigned to: </span>
                <span className="font-medium text-gray-800">{complaint.assignedTo}</span>
              </div>
            )}

            {complaint.status === 'resolved' && !complaint.rating && (
              <button
                onClick={() => setShowRatingModal(complaint.id)}
                className="w-full bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Rate Resolution
              </button>
            )}

            {complaint.rating && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-green-700">Your Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= complaint.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {complaint.feedback && (
                  <p className="text-sm text-green-700">{complaint.feedback}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-6">Rate Resolution</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Share your experience..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleRatingSubmit(showRatingModal)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                  disabled={rating === 0}
                >
                  Submit Rating
                </button>
                <button
                  onClick={() => setShowRatingModal(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {userComplaints.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Complaints Yet</h3>
          <p className="text-gray-500">Click "New Complaint" to lodge your first complaint.</p>
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;