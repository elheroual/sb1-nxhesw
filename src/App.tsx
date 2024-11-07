import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';
import { AuthPage } from './components/auth/AuthPage';
import { Ticket, AuditLog, Notification, TicketStats, User } from './types';
import { auth, db } from './lib/firebase';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  getDoc,
  where,
  Timestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Subscribe to technicians collection
    const techQuery = query(collection(db, 'users'), where('role', '==', 'technician'));
    const unsubTechnicians = onSnapshot(techQuery, (snapshot) => {
      const techData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setTechnicians(techData);
    });

    const unsubTickets = onSnapshot(
      collection(db, 'tickets'),
      (snapshot) => {
        const ticketData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? 
              data.createdAt.toDate().toISOString() : 
              new Date().toISOString(),
            updatedAt: data.updatedAt instanceof Timestamp ? 
              data.updatedAt.toDate().toISOString() : 
              new Date().toISOString(),
          };
        }) as Ticket[];
        setTickets(ticketData);
      }
    );

    const unsubAuditLogs = onSnapshot(
      collection(db, 'auditLogs'),
      (snapshot) => {
        const logData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp ? 
              data.timestamp.toDate().toISOString() : 
              new Date().toISOString(),
          };
        }) as AuditLog[];
        setAuditLogs(logData);
      }
    );

    const unsubNotifications = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        const notifData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? 
              data.createdAt.toDate().toISOString() : 
              new Date().toISOString(),
          };
        }) as Notification[];
        setNotifications(notifData);
      }
    );

    return () => {
      unsubTechnicians();
      unsubTickets();
      unsubAuditLogs();
      unsubNotifications();
    };
  }, [user]);

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
      userId: user?.id,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100">
        <AdminDashboard
          tickets={tickets}
          technicians={technicians}
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

  return (
    <TechnicianDashboard
      technician={user}
      tickets={tickets}
      onStatusChange={(id, status) => {
        const ticket = tickets.find(t => t.id === id);
        if (ticket) {
          handleTicketUpdate({ ...ticket, status });
        }
      }}
    />
  );
}

export default App;