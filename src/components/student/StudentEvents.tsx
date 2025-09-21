import React, { useState } from 'react';
import { Calendar, MessageCircle, Users, Plus, Settings, Send, X, Ban } from 'lucide-react';
import { User, Event, ChatMessage } from '../../App';

interface StudentEventsProps {
  user: User;
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const StudentEvents: React.FC<StudentEventsProps> = ({
  user,
  events,
  setEvents,
  chatMessages,
  setChatMessages
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    venue: ''
  });

  const handleJoinChat = (eventId: string) => {
    setSelectedEvent(eventId);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !selectedEvent) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      eventId: selectedEvent,
      userId: user.id,
      userName: user.name,
      message: chatMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, message]);
    setChatMessage('');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      venue: newEvent.venue,
      organizer: user.name,
      chatEnabled: true,
      adminId: user.id
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({ title: '', description: '', date: '', venue: '' });
    setShowNewEventForm(false);
    alert('Event chat created successfully! You are now the admin.');
  };

  const handleDisableChat = (eventId: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, chatEnabled: false } : event
      )
    );
    setSelectedEvent(null);
  };

  const handleBlockUser = (userId: string) => {
    setBlockedUsers(prev => [...prev, userId]);
    alert('User blocked successfully. Their messages will no longer appear for you.');
  };

  const eventMessages = chatMessages
    .filter(msg => msg.eventId === selectedEvent)
    .filter(msg => !blockedUsers.includes(msg.userId));
    
  const selectedEventData = events.find(e => e.id === selectedEvent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Events</h1>
        </div>
        <button
          onClick={() => setShowNewEventForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Event Chat
        </button>
      </div>

      {/* New Event Form Modal */}
      {showNewEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-6">Create New Event Chat</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Event description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Event venue"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Create Event Chat
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewEventForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">{selectedEventData?.title}</h3>
                <p className="text-sm text-gray-600">{selectedEventData?.venue} • {selectedEventData?.date}</p>
              </div>
              <div className="flex gap-2">
                {selectedEventData?.adminId === user.id && selectedEventData?.chatEnabled && (
                  <button
                    onClick={() => handleDisableChat(selectedEvent)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Disable Chat"
                  >
                    <Ban className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!selectedEventData?.chatEnabled && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>Chat has been disabled by the organizer</p>
                </div>
              )}
              
              {selectedEventData?.chatEnabled && eventMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.userId === user.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.userId !== user.id && (
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-600">{msg.userName}</div>
                        <button
                          onClick={() => handleBlockUser(msg.userId)}
                          className="text-xs text-red-600 hover:text-red-800"
                          title="Block User"
                        >
                          Block
                        </button>
                      </div>
                    )}
                    <div>{msg.message}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {selectedEventData?.chatEnabled && eventMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {selectedEventData?.chatEnabled && (
              <div className="border-t p-4 flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{event.description}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                {event.venue}
              </div>
              <div className="text-xs text-gray-500">
                Organized by: {event.organizer}
              </div>
            </div>

            {event.chatEnabled ? (
              <button
                onClick={() => handleJoinChat(event.id)}
                className="w-full bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Join Chat
              </button>
            ) : (
              <div className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg text-center text-sm">
                Chat Disabled
              </div>
            )}

            {event.adminId === user.id && (
              <div className="mt-2 text-xs text-purple-600 text-center">
                You are the organizer
              </div>
            )}
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Events Scheduled</h3>
          <p className="text-gray-500">Create a new event chat to get started!</p>
        </div>
      )}
    </div>
  );
};

export default StudentEvents;