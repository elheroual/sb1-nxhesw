import React, { useState } from 'react';
import { DashboardStats } from './DashboardStats';
import { TicketTable } from './TicketTable';
import { TicketForm } from './TicketForm';
import { NotificationCenter } from './NotificationCenter';
import { AuditLogComponent } from './AuditLog';
import { AdminStats } from './AdminStats';
import { Header } from '../Header';
import { Ticket, User, AuditLog, Notification, TicketStats } from '../../types';
import { Plus, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useLanguage } from '../../lib/contexts/LanguageContext';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      >
        <div className="flex items-center justify-end gap-3">
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={onNotificationRead}
          />
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowTicketForm(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {t('new.ticket')}
            </button>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              {t('sign.out')}
            </button>
          </div>
        </div>
      </Header>

      {/* Mobile buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 md:hidden z-50">
        <button
          onClick={() => setShowTicketForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          {t('new.ticket')}
        </button>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t('sign.out')}
        </button>
      </div>

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8 animate-fade-in">
            <AdminStats tickets={tickets} technicians={technicians} />

            <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{t('tickets.management')}</h2>
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
      </div>

      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white/90 backdrop-blur-lg animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {t(selectedTicket ? 'ticket.update' : 'ticket.create')}
              </h2>
              <button
                onClick={() => {
                  setShowTicketForm(false);
                  setSelectedTicket(null);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
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
    </div>
  );
};