'use client';

import React from "react";
import { Notification } from '@progress/kendo-react-notification';

const NotificationManager = ({ notifications, setNotifications }) => {
  return (
    <div style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 9999 }}>
      {notifications.map(notification => (
        <div key={notification.id} style={{ marginBottom: '10px' }}>
          <Notification
            type={{ style: notification.type, icon: true }}
            closable={true}
            onClose={() => setNotifications(prev => 
              prev.filter(item => item.id !== notification.id)
            )}
            duration={notification.duration || 3000}
          >
            <span>{notification.message}</span>
          </Notification>
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;