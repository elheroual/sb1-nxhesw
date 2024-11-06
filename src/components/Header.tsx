import React from 'react';
import { TicketStatus } from '../types';
import { ClipboardList } from 'lucide-react';

interface HeaderProps {
  statusFilter: TicketStatus | 'All';
  onStatusFilterChange: (status: TicketStatus | 'All') => void;
}

export const Header: React.FC<HeaderProps> = ({ statusFilter, onStatusFilterChange }) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as TicketStatus | 'All')}
            >
              <option value="All">All Tickets</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};