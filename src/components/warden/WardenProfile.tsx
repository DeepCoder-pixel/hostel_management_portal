import React from 'react';
import { Shield, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { User } from '../../App';

interface WardenProfileProps {
  user: User;
}

const WardenProfile: React.FC<WardenProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Warden Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{user.name}</h3>
              <p className="text-green-600 font-medium">{user.designation}</p>
              <p className="text-gray-600 text-sm">{user.department}</p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Professional Information</h4>
            
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
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Office Phone</div>
                    <div className="font-medium text-gray-800">+1 (555) 911-0001</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Office Location</div>
                    <div className="font-medium text-gray-800">Warden Office, Block A</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Joining Date</div>
                    <div className="font-medium text-gray-800">March 1, 2020</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Managed Blocks</div>
                    <div className="font-medium text-gray-800">Block A, Block B</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Emergency Contact</div>
                    <div className="font-medium text-gray-800">+1 (555) 123-9999</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsibilities */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-6">Key Responsibilities</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-800 mb-3">Administrative Duties</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Oversight of hostel operations and management
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Student welfare and disciplinary matters
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Complaint resolution and staff coordination
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                Emergency response and safety protocols
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-3">Security & Safety</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                Security monitoring and incident management
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                Visitor management and access control
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                Curfew enforcement and attendance tracking
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                Coordination with security personnel
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Office Hours */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-6">
        <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Office Hours
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-green-800">Monday - Friday</div>
            <div className="text-green-700">9:00 AM - 6:00 PM</div>
          </div>
          <div>
            <div className="font-medium text-green-800">Saturday</div>
            <div className="text-green-700">10:00 AM - 4:00 PM</div>
          </div>
          <div>
            <div className="font-medium text-green-800">Sunday</div>
            <div className="text-green-700">Emergency Only</div>
          </div>
          <div>
            <div className="font-medium text-green-800">Emergency</div>
            <div className="text-green-700">24/7 Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenProfile;