import React from 'react';
import { User, Phone, Mail, MapPin, Users, Calendar } from 'lucide-react';
import { User as UserType } from '../../App';

interface StudentProfileProps {
  user: UserType;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <User className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.photo ? (
                  <img 
                    src={user.photo} 
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h3>
              <p className="text-blue-600 font-medium">Student</p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Personal Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium text-gray-800">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Room Number</div>
                    <div className="font-medium text-gray-800">{user.roomNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium text-gray-800">+1 (555) 123-4567</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Guardian Name</div>
                    <div className="font-medium text-gray-800">Robert Doe</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Guardian Phone</div>
                    <div className="font-medium text-gray-800">+1 (555) 987-6543</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Check-in Date</div>
                    <div className="font-medium text-gray-800">August 15, 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-6">Academic Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Student ID</div>
            <div className="font-medium text-gray-800">STU2024001</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Course</div>
            <div className="font-medium text-gray-800">Computer Science</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-1">Year</div>
            <div className="font-medium text-gray-800">3rd Year</div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Emergency Contacts
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-red-700 mb-1">Hostel Security</div>
            <div className="font-medium text-red-800">+1 (555) 911-0000</div>
          </div>
          
          <div>
            <div className="text-sm text-red-700 mb-1">Warden Office</div>
            <div className="font-medium text-red-800">+1 (555) 911-0001</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;