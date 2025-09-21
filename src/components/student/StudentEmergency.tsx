import React, { useState } from 'react';
import { AlertTriangle, Phone, Shield, Zap, MapPin, Clock } from 'lucide-react';
import { User } from '../../App';

interface StudentEmergencyProps {
  user: User;
}

const StudentEmergency: React.FC<StudentEmergencyProps> = ({ user }) => {
  const [sosActive, setSosActive] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState('');
  const [description, setDescription] = useState('');

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: '🏥', color: 'text-red-600' },
    { id: 'fire', label: 'Fire Emergency', icon: '🔥', color: 'text-orange-600' },
    { id: 'security', label: 'Security Issue', icon: '🚨', color: 'text-purple-600' },
    { id: 'electrical', label: 'Electrical Hazard', icon: '⚡', color: 'text-yellow-600' },
    { id: 'other', label: 'Other Emergency', icon: '🆘', color: 'text-gray-600' }
  ];

  const emergencyContacts = [
    { name: 'Hostel Security', number: '+1 (555) 911-0000', type: 'primary' },
    { name: 'Warden Office', number: '+1 (555) 911-0001', type: 'primary' },
    { name: 'Medical Center', number: '+1 (555) 911-0002', type: 'medical' },
    { name: 'Fire Department', number: '911', type: 'fire' },
    { name: 'Local Police', number: '911', type: 'police' }
  ];

  const handleSOS = () => {
    setSosActive(true);
    // In a real app, this would trigger immediate alerts
    setTimeout(() => {
      setSosActive(false);
    }, 5000);
  };

  const handleEmergencyReport = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the emergency report
    alert('Emergency report sent! Help is on the way.');
    setSelectedEmergency('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-800">Emergency Help</h1>
      </div>

      {/* SOS Button */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 p-8 text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Emergency SOS</h2>
          <p className="text-red-700">Press and hold for immediate emergency assistance</p>
        </div>

        <button
          onClick={handleSOS}
          className={`w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center transition-all transform ${
            sosActive
              ? 'bg-red-600 scale-110 animate-pulse shadow-2xl'
              : 'bg-red-500 hover:bg-red-600 hover:scale-105 shadow-xl'
          }`}
        >
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-white mx-auto mb-1" />
            <span className="text-white font-bold">SOS</span>
          </div>
        </button>

        {sosActive && (
          <div className="bg-red-600 text-white rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 animate-spin" />
              <span className="font-bold">EMERGENCY ALERT SENT</span>
            </div>
            <p className="text-sm">Security and warden have been notified. Stay calm, help is on the way.</p>
          </div>
        )}

        <div className="text-sm text-red-700">
          Your location: Room {user.roomNumber} • {user.name}
        </div>
      </div>

      {/* Emergency Report Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Report Non-Critical Emergency</h3>

        <form onSubmit={handleEmergencyReport} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Emergency Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {emergencyTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedEmergency(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedEmergency === type.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <div className={`font-medium ${type.color}`}>{type.label}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedEmergency && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
                placeholder="Please provide details about the emergency..."
                required
              />
            </div>
          )}

          {selectedEmergency && (
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Send Emergency Report
            </button>
          )}
        </form>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Emergency Contacts</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  contact.type === 'primary' ? 'bg-blue-100' :
                  contact.type === 'medical' ? 'bg-green-100' :
                  contact.type === 'fire' ? 'bg-orange-100' :
                  'bg-purple-100'
                }`}>
                  <Phone className={`w-5 h-5 ${
                    contact.type === 'primary' ? 'text-blue-600' :
                    contact.type === 'medical' ? 'text-green-600' :
                    contact.type === 'fire' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.number}</div>
                </div>
              </div>
              <button
                onClick={() => window.open(`tel:${contact.number}`)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Call
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Safety Tips
        </h3>

        <div className="space-y-3 text-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">In case of fire, do not use elevators. Use stairs and exit the building immediately.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">For medical emergencies, try to stay calm and provide clear information about the situation.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">Keep your room number and personal details handy when calling for help.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm">The SOS button immediately alerts security and warden - use it for urgent situations only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEmergency;