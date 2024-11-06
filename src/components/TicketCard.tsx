import React from 'react';
import { Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { Ticket, TicketStatus } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onAssign?: (ticket: Ticket) => void;
  isAdmin?: boolean;
}

const statusColors = {
  'Open': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'On Hold': 'bg-orange-100 text-orange-800',
  'Completed': 'bg-green-100 text-green-800'
};

const priorityColors = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-orange-100 text-orange-800',
  'High': 'bg-red-100 text-red-800'
};

export const TicketCard: React.FC<TicketCardProps> = ({ 
  ticket, 
  onStatusChange, 
  onAssign,
  isAdmin = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[ticket.priority]}`}>
          {ticket.priority}
        </div>
      </div>

      <p className="text-gray-600 mb-4">{ticket.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{ticket.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span>{ticket.technician}</span>
          {isAdmin && onAssign && (
            <button
              onClick={() => onAssign(ticket)}
              className="ml-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Reassign
            </button>
          )}
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
        </div>
        {ticket.estimatedHours && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Estimated: {ticket.estimatedHours}h</span>
            {ticket.actualHours && <span>Actual: {ticket.actualHours}h</span>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[ticket.status]}`}>
          {ticket.status}
        </div>
        
        <select
          className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
};