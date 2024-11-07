import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { TicketList } from '../TicketList';
import { Ticket, TicketStatus, User } from '../../types';
import { LogOut } from 'lucide-react';
import { TechnicianStats } from './TechnicianStats';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../Header';

interface TechnicianDashboardProps {
  technician: User;
  tickets: Ticket[];
  onStatusChange: (id: string, status: TicketStatus) => void;
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({
  technician,
  tickets,
  onStatusChange,
}) => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const assignedTickets = tickets.filter(ticket => ticket.technician === technician.name);

  const handleTicketStatusChange = (id: string, status: TicketStatus) => {
    const ticket = assignedTickets.find(t => t.id === id);
    if (ticket?.status === 'Completed') {
      return;
    }
    onStatusChange(id, status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMenuOpen={isMobileMenuOpen}
      />

      <div className="fixed top-16 right-4 z-40 flex items-center gap-2 p-4">
        <div className="text-gray-600 mr-4">
          {t('welcome')}, {technician.name}
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t('sign.out')}
        </button>
      </div>

      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <TechnicianStats tickets={tickets} technicianName={technician.name} />
          
          <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('assigned.tickets')}</h2>
              <TicketList
                tickets={assignedTickets}
                onStatusChange={handleTicketStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};