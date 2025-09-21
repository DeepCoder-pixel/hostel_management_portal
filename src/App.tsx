import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/student/StudentDashboard';
import WardenDashboard from './components/warden/WardenDashboard';
import HousekeepingDashboard from './components/housekeeping/HousekeepingDashboard';
import SecurityDashboard from './components/security/SecurityDashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'warden' | 'housekeeping' | 'security';
  roomNumber?: string;
  department?: string;
  designation?: string;
  photo?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  category: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  assignedTo: string;
  createdAt: Date;
  resolvedAt?: Date;
  image?: string;
  rating?: number;
  feedback?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  expiryDate?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  organizer: string;
  chatEnabled: boolean;
  adminId: string;
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

export interface SecurityAlert {
  id: string;
  type: 'curfew' | 'unauthorized_entry' | 'investigation';
  studentId: string;
  studentName: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([
    {
      id: '1',
      title: 'Mess Menu Updated',
      content: 'New breakfast menu includes continental options. Check the updated timings: Breakfast: 7:30 AM - 10:00 AM, Lunch: 12:30 PM - 3:00 PM, Dinner: 7:30 PM - 10:00 PM.',
      category: 'mess',
      createdBy: 'Dr. Smith',
      createdAt: new Date('2025-01-14'),
      expiryDate: new Date('2025-01-30')
    },
    {
      id: '2',
      title: 'Wi-Fi Maintenance',
      content: 'Wi-Fi will be temporarily unavailable on January 16th from 2:00 PM to 4:00 PM for maintenance work. Please plan accordingly.',
      category: 'maintenance',
      createdBy: 'IT Team',
      createdAt: new Date('2025-01-13')
    }
  ]);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Hostel Cricket Tournament',
      description: 'Annual cricket tournament organized by senior students',
      date: '2025-01-20',
      venue: 'Hostel Ground',
      organizer: 'Senior Student Council',
      chatEnabled: true,
      adminId: 'senior1'
    }
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'curfew',
      studentId: '2',
      studentName: 'Jane Smith',
      description: 'Student returned after curfew hours (11:45 PM)',
      status: 'pending',
      createdAt: new Date('2025-01-15')
    }
  ]);
  const [housekeepingMessages, setHousekeepingMessages] = useState<any[]>([]);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  const commonProps = {
    user,
    complaints,
    setComplaints,
    notices,
    setNotices,
    events,
    setEvents,
    chatMessages,
    setChatMessages,
    securityAlerts,
    setSecurityAlerts,
    housekeepingMessages,
    setHousekeepingMessages,
    onLogout: () => setUser(null)
  };

  switch (user.role) {
    case 'student':
      return <StudentDashboard {...commonProps} />;
    case 'warden':
      return <WardenDashboard {...commonProps} />;
    case 'housekeeping':
      return <HousekeepingDashboard {...commonProps} />;
    case 'security':
      return <SecurityDashboard {...commonProps} />;
    default:
      return <LoginPage onLogin={setUser} />;
  }
}

export default App;