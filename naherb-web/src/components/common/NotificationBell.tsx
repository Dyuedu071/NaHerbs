"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGetAuthMe } from '@/services/generated/customer-profile/customer-profile';
import { useWebSocket } from '../websocket/WebSocketContext';
import { customInstance } from '@/services/api-client';
import { useRouter } from 'next/navigation';

interface NotificationDto {
  id: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data } = useGetAuthMe({
    query: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  });

  const user = data as unknown as { id: string; role: string } | undefined;
  const { client, connected } = useWebSocket();

  const isAdmin = user?.role === 'ADMIN';

  // Fetch initial notifications
  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      try {
        const endpoint = isAdmin ? '/notifications/admin' : '/notifications/my';
        const res = await customInstance<NotificationDto[]>({ url: endpoint, method: 'GET' });
        setNotifications(res || []);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    
    fetchHistory();
  }, [user, isAdmin]);

  // Subscribe to WS
  useEffect(() => {
    if (!user || !client || !connected) return;

    const topic = isAdmin ? '/topic/admin/notifications' : `/topic/user/${user.id}/notifications`;
    
    const subscription = client.subscribe(topic, (message) => {
      if (message.body) {
        try {
          const newNotif = JSON.parse(message.body) as NotificationDto;
          setNotifications((prev) => [newNotif, ...prev]);
        } catch (e) {
          console.error("Failed to parse notification message", e);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, client, connected, isAdmin]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notif: NotificationDto) => {
    setIsOpen(false);
    if (!notif.isRead) {
      try {
        const endpoint = isAdmin ? `/notifications/admin/${notif.id}/read` : `/notifications/my/${notif.id}/read`;
        await customInstance({ url: endpoint, method: 'POST' });
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    }
    
    if (notif.link) {
      router.push(notif.link);
    }
  };

  if (!user) return null;

  return (
    <div className="relative inline-flex items-center">
      <button 
        type="button"
        className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 relative inline-flex items-center cursor-pointer"
        title="Thông báo"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-surface">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl shadow-ambient-2 z-50 border border-herbal-beige overflow-hidden">
            <div className="px-4 py-3 border-b border-herbal-beige flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-label-lg text-primary">Thông báo</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-secondary text-body-sm">
                  Không có thông báo nào.
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 border-b border-herbal-beige/50 hover:bg-success-bg cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-label-md ${!notif.isRead ? 'text-primary' : 'text-text-main'}`}>
                        {notif.title}
                      </span>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-error flex-shrink-0 mt-1.5"></span>}
                    </div>
                    <p className="text-body-sm text-secondary line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-secondary mt-2 block">
                      {new Date(notif.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
