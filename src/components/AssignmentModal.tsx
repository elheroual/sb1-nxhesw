import React, { useState } from 'react';
import { User, Ticket } from '../types';

interface AssignmentModalProps {
  ticket: Ticket;
  technicians: User[];
  onAssign: (ticketId: string, technicianName: string) => void;
  onClose: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  ticket,
  technicians,
  onAssign,
  onClose,
}) => {
  const [selectedTechnician, setSelectedTechnician] = useState(ticket.technician);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(ticket.id, selectedTechnician);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Assign Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ticket: {ticket.title}
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              {technicians
                .filter((tech) => tech.role === 'technician')
                .map((tech) => (
                  <option key={tech.id} value={tech.name}>
                    {tech.name} - {tech.department}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};