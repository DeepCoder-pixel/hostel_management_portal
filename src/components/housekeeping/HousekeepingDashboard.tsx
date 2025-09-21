import React, { useState } from 'react';
import { Wrench, MessageSquare, CheckCircle, Clock, LogOut, Menu, X, Home } from 'lucide-react';
import { User as UserType } from '../../App';

interface HousekeepingDashboardProps {
  user: UserType;
  housekeepingMessages: any[];
  setHousekeepingMessages: React.Dispatch<React.SetStateAction<any[]>>;
  onLogout: () => void;
}

const HousekeepingDashboard: React.FC<HousekeepingDashboardProps> = ({
  user,
  housekeepingMessages,
  setHousekeepingMessages,
  onLogout
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleMarkComplete = (messageId: string) => {
    setCompletedTasks(prev => [...prev, messageId]);
    // In a real app, this would update the complaint status in the main system
    alert('Task marked as completed. Status updated in system.');
  };

  const pendingTasks = housekeepingMessages.filter(msg => !completedTasks.includes(msg.id));
  const completedTasksList = housekeepingMessages.filter(msg => completedTasks.includes(msg.id));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-orange-600">Housekeeping</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            <div className="px-4 py-3 bg-orange-100 text-orange-700 rounded-lg border border-orange-200">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-600">{user.designation}</div>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <Wrench className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-800">Housekeeping Dashboard</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Pending Tasks</h3>
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">{pendingTasks.length}</div>
                <div className="text-sm text-orange-700">Awaiting completion</div>
              </div>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-green-800">Completed</h3>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">{completedTasksList.length}</div>
                <div className="text-sm text-green-700">Tasks finished</div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Total</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{housekeepingMessages.length}</div>
                <div className="text-sm text-blue-700">All assignments</div>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-600" />
                Pending Tasks
              </h3>

              {pendingTasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingTasks.map((message) => (
                    <div key={message.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-800">Room {message.roomNumber}</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {message.category}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{message.description}</p>
                          
                          <div className="text-sm text-gray-500">
                            <div>Student: {message.studentName}</div>
                            <div>Assigned: {new Date(message.timestamp).toLocaleString()}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleMarkComplete(message.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Pending Tasks</h3>
                  <p className="text-gray-500">All assignments have been completed. Great work!</p>
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasksList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Completed Tasks
                </h3>

                <div className="space-y-4">
                  {completedTasksList.map((message) => (
                    <div key={message.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">Room {message.roomNumber}</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {message.category}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          COMPLETED
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{message.description}</p>
                      
                      <div className="text-sm text-gray-500">
                        <div>Student: {message.studentName}</div>
                        <div>Completed: {new Date().toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;