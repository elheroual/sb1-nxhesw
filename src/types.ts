export type TicketStatus = 'Open' | 'In Progress' | 'On Hold' | 'Completed';
export type UserRole = 'admin' | 'technician';
export type Priority = 'Low' | 'Medium' | 'High';
export type NotificationType = 'deadline' | 'urgent' | 'assignment' | 'status';
export type ProductType = 'Fixe' | 'ADSL' | 'GPON';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
  ticketsCompleted: number;
  averageResolutionTime: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: [number, number]; // [longitude, latitude]
  technician: string;
  status: TicketStatus;
  priority: Priority;
  productType: ProductType;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
}

export interface AuditLog {
  id: string;
  ticketId: string;
  action: 'create' | 'update' | 'delete' | 'assign';
  userId: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  ticketId: string;
  createdAt: string;
  isRead: boolean;
}

export interface TicketStats {
  total: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<Priority, number>;
  byProductType: Record<ProductType, number>;
  overdue: number;
  dueToday: number;
}