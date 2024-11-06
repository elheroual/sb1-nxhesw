import React from 'react';
import { TicketCard } from './TicketCard';
import { Ticket, TicketStatus } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  onStatusChange: (id: string, status: TicketStatus) => void;
  onAssign?: (ticket: Ticket) => void;
  isAdmin?: boolean;
}

export const TicketList: React.FC<TicketListProps> = ({ 
  tickets, 
  onStatusChange,
  onAssign,
  isAdmin = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onStatusChange={onStatusChange}
          onAssign={onAssign}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};