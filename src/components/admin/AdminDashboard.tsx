import React, { useState } from 'react';
import { DashboardStats } from './DashboardStats';
import { TicketTable } from './TicketTable';
import { TicketForm } from './TicketForm';
import { NotificationCenter } from './NotificationCenter';
import { AuditLogComponent } from './AuditLog';
import { AdminStats } from './AdminStats';
import { Ticket, User, AuditLog, Notification, TicketStats } from '../../types';
import { Plus, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AdminDashboardProps {
  tickets: Ticket[];
  technicians: User[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  stats: TicketStats;
  onTicketCreate: (ticket: Partial<Ticket>) => void;
  onTicketUpdate: (ticket: Ticket) => void;
  onTicketDelete: (ticket: Ticket) => void;
  onTicketAssign: (ticket: Ticket) => void;
  onNotificationRead: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  technicians,
  auditLogs,
  notifications,
  stats,
  onTicketCreate,
  onTicketUpdate,
  onTicketDelete,
  onTicketAssign,
  onNotificationRead,
}) => {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleTicketSubmit = (ticketData: Partial<Ticket>) => {
    if (selectedTicket) {
      onTicketUpdate({ ...selectedTicket, ...ticketData });
    } else {
      onTicketCreate(ticketData);
    }
    setShowTicketForm(false);
    setSelectedTicket(null);
  };

  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketForm(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={onNotificationRead}
          />
          <button
            onClick={() => setShowTicketForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Ticket
          </button>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      <AdminStats tickets={tickets} technicians={technicians} />

      {showTicketForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTicket ? 'Edit Ticket' : 'Create New Ticket'}
              </h2>
              <button
                onClick={() => {
                  setShowTicketForm(false);
                  setSelectedTicket(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <TicketForm
              ticket={selectedTicket || undefined}
              technicians={technicians}
              onSubmit={handleTicketSubmit}
              onCancel={() => {
                setShowTicketForm(false);
                setSelectedTicket(null);
              }}
            />
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tickets</h2>
            <TicketTable
              tickets={tickets}
              onEdit={handleEditClick}
              onDelete={onTicketDelete}
              onAssign={onTicketAssign}
            />
          </div>
        </div>

        <AuditLogComponent logs={auditLogs} />
      </div>
    </div>
  );
};