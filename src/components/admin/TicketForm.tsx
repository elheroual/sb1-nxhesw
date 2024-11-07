import React, { useState } from 'react';
import { Ticket, User, Priority, TicketStatus, ProductType } from '../../types';
import { Calendar, Clock, MapPin, Tag, Users, Router } from 'lucide-react';

interface TicketFormProps {
  ticket?: Ticket;
  technicians: User[];
  onSubmit: (ticket: Partial<Ticket>) => void;
  onCancel: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  ticket,
  technicians,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Ticket>>(
    ticket || {
      title: '',
      description: '',
      location: '',
      technician: '',
      priority: 'Medium',
      status: 'Open',
      productType: 'Fixe',
      dueDate: new Date().toISOString().split('T')[0],
      estimatedHours: 1,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          required
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Type</label>
          <div className="mt-1 relative">
            <Router className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              required
              className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
              value={formData.productType}
              onChange={(e) => setFormData({ ...formData, productType: e.target.value as ProductType })}
            >
              <option value="Fixe">Fixe</option>
              <option value="ADSL">ADSL</option>
              <option value="GPON">GPON</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div className="mt-1 relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              required
              className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Assigned Technician</label>
          <div className="mt-1 relative">
            <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              required
              className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
              value={formData.technician}
              onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
            >
              <option value="">Select Technician</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.name}>
                  {tech.name} - {tech.department}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Date</label>
          <div className="mt-1 relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              required
              className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
              value={formData.dueDate?.split('T')[0]}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estimated Hours</label>
          <div className="mt-1 relative">
            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="number"
              min="0.5"
              step="0.5"
              required
              className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TicketStatus })}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {ticket ? 'Update Ticket' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
};