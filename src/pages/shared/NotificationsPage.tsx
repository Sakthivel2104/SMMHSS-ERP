import { useState } from 'react';
import { db } from '@/data/mockStore';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Check, Download, FileText } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(db.getNotifications(user?.role));

  const handleMarkRead = (id: number) => {
    db.markNotificationRead(id);
    setNotifications([...db.getNotifications(user?.role)]);
  };

  const handleDownload = (n: any) => {
    if (n.attachmentData && n.attachmentName) {
      const link = document.createElement('a');
      link.href = n.attachmentData;
      link.download = n.attachmentName;
      link.click();
    }
  };

  const typeIcons: Record<string, string> = {
    homework: 'bg-primary/10 text-primary',
    event: 'bg-warning/10 text-warning',
    meeting: 'bg-success/10 text-success',
    announcement: 'bg-accent text-accent-foreground',
    fee: 'bg-destructive/10 text-destructive',
    notes: 'bg-secondary text-secondary-foreground',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground">{notifications.filter(n => !n.read).length} unread</p>
      </div>

      <div className="space-y-3">
        {notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(n => (
          <div key={n.id} className={`erp-card p-4 flex items-start gap-4 ${!n.read ? 'border-l-2 border-l-primary' : 'opacity-75'}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeIcons[n.type] || 'bg-muted'}`}>
              {n.type === 'notes' ? <FileText className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                </div>
                {!n.read && (
                  <button onClick={() => handleMarkRead(n.id)} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 ml-2">
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-muted-foreground">{n.date}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-medium ${typeIcons[n.type] || ''}`}>{n.type}</span>
                {n.attachmentName && (
                  <button onClick={() => handleDownload(n)} className="text-xs text-primary hover:underline flex items-center gap-1 ml-2">
                    <Download className="w-3 h-3" /> Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
