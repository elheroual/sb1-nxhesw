import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { mockUsers } from './data';
import { Ticket, AuditLog, Notification, TicketStats } from './types';
import { db } from './lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAdmin] = useState(true);

  useEffect(() => {
    // Subscribe to tickets collection
    const unsubTickets = onSnapshot(
      collection(db, 'tickets'),
      (snapshot) => {
        const ticketData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate().toISOString(),
        })) as Ticket[];
        setTickets(ticketData);
      }
    );

    // Subscribe to audit logs collection
    const unsubAuditLogs = onSnapshot(
      collection(db, 'auditLogs'),
      (snapshot) => {
        const logData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toISOString(),
        })) as AuditLog[];
        setAuditLogs(logData);
      }
    );

    // Subscribe to notifications collection
    const unsubNotifications = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        const notifData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toISOString(),
        })) as Notification[];
        setNotifications(notifData);
      }
    );

    return () => {
      unsubTickets();
      unsubAuditLogs();
      unsubNotifications();
    };
  }, []);

  const calculateStats = (): TicketStats => {
    const today = new Date().toISOString().split('T')[0];
    
    return {
      total: tickets.length,
      byStatus: {
        Open: tickets.filter(t => t.status === 'Open').length,
        'In Progress': tickets.filter(t => t.status === 'In Progress').length,
        'On Hold': tickets.filter(t => t.status === 'On Hold').length,
        Completed: tickets.filter(t => t.status === 'Completed').length,
      },
      byPriority: {
        Low: tickets.filter(t => t.priority === 'Low').length,
        Medium: tickets.filter(t => t.priority === 'Medium').length,
        High: tickets.filter(t => t.priority === 'High').length,
      },
      overdue: tickets.filter(t => t.dueDate < today && t.status !== 'Completed').length,
      dueToday: tickets.filter(t => t.dueDate === today).length,
    };
  };

  const addAuditLog = async (action: AuditLog['action'], ticketId: string, details: string) => {
    await addDoc(collection(db, 'auditLogs'), {
      ticketId,
      action,
      userId: 'U1004',
      timestamp: serverTimestamp(),
      details,
    });
  };

  const addNotification = async (type: Notification['type'], message: string, ticketId: string) => {
    await addDoc(collection(db, 'notifications'), {
      type,
      message,
      ticketId,
      createdAt: serverTimestamp(),
      isRead: false,
    });
  };

  const handleTicketCreate = async (ticketData: Partial<Ticket>) => {
    const docRef = await addDoc(collection(db, 'tickets'), {
      ...ticketData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    await addAuditLog('create', docRef.id, `Ticket "${ticketData.title}" created`);
    await addNotification('assignment', `New ticket assigned to ${ticketData.technician}`, docRef.id);
  };

  const handleTicketUpdate = async (updatedTicket: Ticket) => {
    const ticketRef = doc(db, 'tickets', updatedTicket.id);
    await updateDoc(ticketRef, {
      ...updatedTicket,
      updatedAt: serverTimestamp(),
    });
    
    await addAuditLog('update', updatedTicket.id, `Ticket "${updatedTicket.title}" updated`);
  };

  const handleTicketDelete = async (ticket: Ticket) => {
    await deleteDoc(doc(db, 'tickets', ticket.id));
    await addAuditLog('delete', ticket.id, `Ticket "${ticket.title}" deleted`);
  };

  const handleTicketAssign = async (ticket: Ticket) => {
    await addAuditLog('assign', ticket.id, `Ticket "${ticket.title}" reassigned`);
    await addNotification('assignment', `Ticket reassigned to ${ticket.technician}`, ticket.id);
  };

  const handleNotificationRead = async (id: string) => {
    const notifRef = doc(db, 'notifications', id);
    await updateDoc(notifRef, { isRead: true });
  };

  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date().toISOString().split('T')[0];
      tickets.forEach(async (ticket) => {
        if (ticket.dueDate === today && ticket.status !== 'Completed') {
          await addNotification('deadline', `Ticket "${ticket.title}" is due today`, ticket.id);
        }
        if (ticket.dueDate < today && ticket.status !== 'Completed') {
          await addNotification('urgent', `Ticket "${ticket.title}" is overdue`, ticket.id);
        }
      });
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [tickets]);

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboard
        tickets={tickets}
        technicians={mockUsers.filter(user => user.role === 'technician')}
        auditLogs={auditLogs}
        notifications={notifications}
        stats={calculateStats()}
        onTicketCreate={handleTicketCreate}
        onTicketUpdate={handleTicketUpdate}
        onTicketDelete={handleTicketDelete}
        onTicketAssign={handleTicketAssign}
        onNotificationRead={handleNotificationRead}
      />
    </div>
  );
}

export default App;