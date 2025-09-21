import React, { useState } from 'react';
import { Settings, Users, Plus, Edit, Trash, Search } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  roomNumber: string;
  course: string;
  year: string;
  guardianName: string;
  guardianPhone: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.student@hostel.com',
    roomNumber: 'A-101',
    course: 'Computer Science',
    year: '3rd Year',
    guardianName: 'Robert Doe',
    guardianPhone: '+1 (555) 987-6543'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@hostel.com',
    roomNumber: 'B-203',
    course: 'Engineering',
    year: '2nd Year',
    guardianName: 'Mary Smith',
    guardianPhone: '+1 (555) 123-4567'
  }
];

const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    email: 'mike.housekeeping@hostel.com',
    department: 'Housekeeping',
    designation: 'Supervisor',
    phone: '+1 (555) 111-0001'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.security@hostel.com',
    department: 'Security',
    designation: 'Officer',
    phone: '+1 (555) 111-0002'
  }
];

const WardenAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Student & Staff>>({});

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.roomNumber || !formData.course || !formData.year || !formData.guardianName || !formData.guardianPhone) {
      alert('Please fill all required fields');
      return;
    }

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      roomNumber: formData.roomNumber,
      course: formData.course,
      year: formData.year,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone
    };
    setStudents(prev => [...prev, newStudent]);
    resetForm();
    alert('Student added successfully!');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.department || !formData.designation || !formData.phone) {
      alert('Please fill all required fields');
      return;
    }

    const newStaff: Staff = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      designation: formData.designation,
      phone: formData.phone
    };
    setStaff(prev => [...prev, newStaff]);
    resetForm();
    alert('Staff added successfully!');
  };

  const handleEdit = (item: Student | Staff) => {
    setEditingId(item.id);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'students') {
      setStudents(prev => 
        prev.map(student => 
          student.id === editingId ? { ...student, ...formData } as Student : student
        )
      );
    } else {
      setStaff(prev => 
        prev.map(staffMember => 
          staffMember.id === editingId ? { ...staffMember, ...formData } as Staff : staffMember
        )
      );
    }
    resetForm();
    alert(`${activeTab === 'students' ? 'Student' : 'Staff'} updated successfully!`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (activeTab === 'students') {
        setStudents(prev => prev.filter(student => student.id !== id));
      } else {
        setStaff(prev => prev.filter(staffMember => staffMember.id !== id));
      }
      alert('Record deleted successfully!');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staff.filter(staffMember =>
    staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staffMember.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Settings className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Admin Controls</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('students');
              resetForm();
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'students'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Student Management
          </button>
          <button
            onClick={() => {
              setActiveTab('staff');
              resetForm();
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'staff'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Staff Management
          </button>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 flex-1 min-w-64">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add {activeTab === 'students' ? 'Student' : 'Staff'}
            </button>
          </div>

          {/* Add/Edit Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-6">
                  {editingId ? 'Edit' : 'Add'} {activeTab === 'students' ? 'Student' : 'Staff'}
                </h3>
                
                <form onSubmit={editingId ? handleUpdate : (activeTab === 'students' ? handleAddStudent : handleAddStaff)} className="space-y-4">
                  {activeTab === 'students' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                          <input
                            type="text"
                            value={formData.roomNumber || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                          <input
                            type="text"
                            value={formData.course || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                          <select
                            value={formData.year || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Name *</label>
                          <input
                            type="text"
                            value={formData.guardianName || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Guardian Phone *</label>
                        <input
                          type="tel"
                          value={formData.guardianPhone || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                          <select
                            value={formData.department || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select Department</option>
                            <option value="Housekeeping">Housekeeping</option>
                            <option value="Security">Security</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Administration">Administration</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                          <input
                            type="text"
                            value={formData.designation || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      {editingId ? 'Update' : 'Add'} {activeTab === 'students' ? 'Student' : 'Staff'}
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

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {activeTab === 'students' ? (
                    <>
                      <th className="text-left py-3 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 font-medium text-gray-700">Room</th>
                      <th className="text-left py-3 font-medium text-gray-700">Course</th>
                      <th className="text-left py-3 font-medium text-gray-700">Year</th>
                      <th className="text-left py-3 font-medium text-gray-700">Guardian</th>
                      <th className="text-left py-3 font-medium text-gray-700">Actions</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 font-medium text-gray-700">Designation</th>
                      <th className="text-left py-3 font-medium text-gray-700">Phone</th>
                      <th className="text-left py-3 font-medium text-gray-700">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'students' ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-800">{student.name}</td>
                      <td className="py-3 text-gray-600">{student.email}</td>
                      <td className="py-3 text-gray-600">{student.roomNumber}</td>
                      <td className="py-3 text-gray-600">{student.course}</td>
                      <td className="py-3 text-gray-600">{student.year}</td>
                      <td className="py-3 text-gray-600">{student.guardianName}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Student"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Student"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredStaff.map((staffMember) => (
                    <tr key={staffMember.id} className="border-b border-gray-100">
                      <td className="py-3 font-medium text-gray-800">{staffMember.name}</td>
                      <td className="py-3 text-gray-600">{staffMember.email}</td>
                      <td className="py-3 text-gray-600">{staffMember.department}</td>
                      <td className="py-3 text-gray-600">{staffMember.designation}</td>
                      <td className="py-3 text-gray-600">{staffMember.phone}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(staffMember)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Staff"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(staffMember.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Staff"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {((activeTab === 'students' && filteredStudents.length === 0) || 
            (activeTab === 'staff' && filteredStaff.length === 0)) && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No {activeTab} Found</h3>
              <p className="text-gray-500">
                {searchTerm ? `No ${activeTab} match your search criteria.` : `No ${activeTab} have been added yet.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WardenAdmin;