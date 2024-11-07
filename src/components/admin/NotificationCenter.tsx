import React, { useState } from 'react';
import { Notification } from '../../types';
import { Bell, Clock, AlertTriangle, UserPlus, RefreshCw } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'deadline':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'urgent':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'assignment':
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case 'status':
      return <RefreshCw className="h-5 w-5 text-green-500" />;
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button 
        className="relative p-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    onMarkAsRead(notification.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};