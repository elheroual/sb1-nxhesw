import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { mockTickets, mockUsers } from './data';
import { Ticket, AuditLog, Notification, TicketStats } from './types';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAdmin] = useState(true); // In production, this would come from auth

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

  const addAuditLog = (action: AuditLog['action'], ticketId: string, details: string) => {
    const newLog: AuditLog = {
      id: `LOG${Date.now()}`,
      ticketId,
      action,
      userId: 'U1004',
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (type: Notification['type'], message: string, ticketId: string) => {
    const newNotification: Notification = {
      id: `NOTIF${Date.now()}`,
      type,
      message,
      ticketId,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleTicketCreate = (ticketData: Partial<Ticket>) => {
    const newTicket: Ticket = {
      id: `T${Date.now()}`,
      ...ticketData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Ticket;
    
    setTickets(prev => [...prev, newTicket]);
    addAuditLog('create', newTicket.id, `Ticket "${newTicket.title}" created`);
    addNotification('assignment', `New ticket assigned to ${newTicket.technician}`, newTicket.id);
  };

  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === updatedTicket.id
        ? { ...updatedTicket, updatedAt: new Date().toISOString() }
        : ticket
    ));
    addAuditLog('update', updatedTicket.id, `Ticket "${updatedTicket.title}" updated`);
  };

  const handleTicketDelete = (ticket: Ticket) => {
    setTickets(prev => prev.filter(t => t.id !== ticket.id));
    addAuditLog('delete', ticket.id, `Ticket "${ticket.title}" deleted`);
  };

  const handleTicketAssign = (ticket: Ticket) => {
    addAuditLog('assign', ticket.id, `Ticket "${ticket.title}" reassigned`);
    addNotification('assignment', `Ticket reassigned to ${ticket.technician}`, ticket.id);
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Check for overdue tickets and deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date().toISOString().split('T')[0];
      tickets.forEach(ticket => {
        if (ticket.dueDate === today && ticket.status !== 'Completed') {
          addNotification('deadline', `Ticket "${ticket.title}" is due today`, ticket.id);
        }
        if (ticket.dueDate < today && ticket.status !== 'Completed') {
          addNotification('urgent', `Ticket "${ticket.title}" is overdue`, ticket.id);
        }
      });
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 1000 * 60 * 60); // Check every hour
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