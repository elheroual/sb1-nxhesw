import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { TicketList } from '../TicketList';
import { Ticket, TicketStatus, User } from '../../types';
import { LogOut, User as UserIcon } from 'lucide-react';

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
  const handleSignOut = () => {
    signOut(auth);
  };

  const assignedTickets = tickets.filter(ticket => ticket.technician === technician.name);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <UserIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
                <p className="text-gray-600">Welcome, {technician.name}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Assigned Tickets</h2>
          <TicketList
            tickets={assignedTickets}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  );
};