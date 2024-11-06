import { Ticket, User } from './types';

export const mockUsers: User[] = [
  {
    id: 'U1001',
    name: 'John Smith',
    role: 'technician',
    email: 'john.smith@company.com',
    department: 'IT Support',
    ticketsCompleted: 145,
    averageResolutionTime: 3.5
  },
  {
    id: 'U1002',
    name: 'Sarah Johnson',
    role: 'technician',
    email: 'sarah.johnson@company.com',
    department: 'Hardware',
    ticketsCompleted: 168,
    averageResolutionTime: 2.8
  },
  {
    id: 'U1003',
    name: 'Mike Wilson',
    role: 'technician',
    email: 'mike.wilson@company.com',
    department: 'Software',
    ticketsCompleted: 132,
    averageResolutionTime: 4.2
  },
  {
    id: 'U1004',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@company.com',
    department: 'Management',
    ticketsCompleted: 0,
    averageResolutionTime: 0
  }
];

export const mockTickets: Ticket[] = [
  {
    id: 'T1001',
    title: 'Network Outage - Building A',
    description: 'Complete network failure affecting all workstations in Building A. Requires immediate attention.',
    location: 'Building A - Floor 2',
    technician: 'John Smith',
    status: 'Open',
    priority: 'High',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-10T08:00:00Z',
    dueDate: '2024-03-11',
    estimatedHours: 4,
    actualHours: 0
  },
  {
    id: 'T1002',
    title: 'Printer Maintenance',
    description: 'Regular maintenance check for printer HP-2100 in marketing department.',
    location: 'Building B - Marketing',
    technician: 'Sarah Johnson',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2024-03-09T15:30:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
    dueDate: '2024-03-12',
    estimatedHours: 2,
    actualHours: 1.5
  },
  {
    id: 'T1003',
    title: 'Software Installation',
    description: 'Install updated CAD software on engineering workstations.',
    location: 'Building C - Engineering',
    technician: 'Mike Wilson',
    status: 'On Hold',
    priority: 'Low',
    createdAt: '2024-03-08T11:20:00Z',
    updatedAt: '2024-03-09T14:00:00Z',
    dueDate: '2024-03-15',
    estimatedHours: 3,
    actualHours: 1
  }
];