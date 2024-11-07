import { Ticket, User } from './types';

export const mockUsers: User[] = [
  {
    id: 'U1001',
    name: 'BRAHIM',
    role: 'technician',
    email: 'brahim@company.com',
    department: 'IT Support',
    ticketsCompleted: 145,
    averageResolutionTime: 3.5
  },
  {
    id: 'U1002',
    name: 'ABDILAH',
    role: 'technician',
    email: 'abdilah@company.com',
    department: 'Hardware',
    ticketsCompleted: 168,
    averageResolutionTime: 2.8
  },
  {
    id: 'U1003',
    name: 'ABDERAHMAN',
    role: 'technician',
    email: 'abderahman@company.com',
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
    technician: 'BRAHIM',
    status: 'Open',
    priority: 'High',
    productType: 'GPON',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-10T08:00:00Z',
    dueDate: '2024-03-11',
    estimatedHours: 4,
    actualHours: 0
  },
  {
    id: 'T1002',
    title: 'Internet Connection Issues',
    description: 'Slow internet connection affecting marketing department.',
    location: 'Building B - Marketing',
    technician: 'ABDILAH',
    status: 'In Progress',
    priority: 'Medium',
    productType: 'ADSL',
    createdAt: '2024-03-09T15:30:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
    dueDate: '2024-03-12',
    estimatedHours: 2,
    actualHours: 1.5
  },
  {
    id: 'T1003',
    title: 'Phone Line Installation',
    description: 'New phone line installation request for engineering department.',
    location: 'Building C - Engineering',
    technician: 'ABDERAHMAN',
    status: 'On Hold',
    priority: 'Low',
    productType: 'Fixe',
    createdAt: '2024-03-08T11:20:00Z',
    updatedAt: '2024-03-09T14:00:00Z',
    dueDate: '2024-03-15',
    estimatedHours: 3,
    actualHours: 1
  }
];