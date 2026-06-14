import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, AlertCircle, Info, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { cn } from '../../utils/cn';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/notifications?limit=10');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up polling every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'alert':
        return <AlertCircle size={18} className="text-red-500" />;
      case 'success':
        return <Check size={18} className="text-green-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) fetchNotifications();
        }}
        className="p-2 relative text-slate-500 hover:text-red-600 bg-slate-100 hover:bg-red-50 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-[wiggle_1s_ease-in-out_infinite]" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -translate-y-1 translate-x-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 backdrop-blur-sm">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs py-0.5 px-2 rounded-full font-semibold">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Bell size={24} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No notifications yet</p>
                <p className="text-slate-400 text-sm mt-1">We'll let you know when something comes up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id}
                    className={cn(
                      "p-4 hover:bg-slate-50 transition-colors duration-200 group relative",
                      !notification.isRead ? "bg-red-50/30" : ""
                    )}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-red-500 group-hover:h-8 transition-all duration-300 rounded-r"></div>
                    )}
                    
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          notification.type === 'alert' ? 'bg-red-100' : 'bg-blue-100'
                        )}>
                          {getIconForType(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={cn(
                            "text-sm font-semibold truncate pr-4",
                            !notification.isRead ? "text-slate-900" : "text-slate-700"
                          )}>
                            {notification.title}
                          </p>
                          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                            <Clock size={10} />
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm line-clamp-2",
                          !notification.isRead ? "text-slate-700" : "text-slate-500"
                        )}>
                          {notification.message}
                        </p>
                        
                        {/* Actions */}
                        <div className="mt-3 flex items-center justify-between">
                          {notification.relatedRequest ? (
                            <Link 
                              to={`/dashboard?requestId=${notification.relatedRequest._id || notification.relatedRequest}`}
                              onClick={() => {
                                setIsOpen(false);
                                if (!notification.isRead) handleMarkAsRead(notification._id);
                              }}
                              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                            >
                              View Request <ChevronRight size={14} />
                            </Link>
                          ) : (
                            <div></div>
                          )}
                          
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                            >
                              <Check size={12} /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-center">
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
