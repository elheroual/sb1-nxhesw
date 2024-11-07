import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Ticket, User } from '../../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isPast, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AdminStatsProps {
  tickets: Ticket[];
  technicians: User[];
}

export const AdminStats: React.FC<AdminStatsProps> = ({ tickets, technicians }) => {
  // Daily tickets data
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const dailyTickets = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return tickets.filter(ticket => 
      ticket.createdAt.split('T')[0] === dayStr
    ).length;
  });

  // Technician performance data
  const technicianPerformance = technicians
    .filter(tech => tech.role === 'technician')
    .map(tech => {
      const techTickets = tickets.filter(ticket => ticket.technician === tech.name);
      const completed = techTickets.filter(ticket => ticket.status === 'Completed');
      const onTime = completed.filter(ticket => 
        !isPast(parseISO(ticket.dueDate)) || 
        new Date(ticket.updatedAt) <= parseISO(ticket.dueDate)
      ).length;
      
      return {
        name: tech.name,
        completed: completed.length,
        onTime,
      };
    });

  // Status distribution data
  const statusCounts = {
    Open: tickets.filter(t => t.status === 'Open').length,
    'In Progress': tickets.filter(t => t.status === 'In Progress').length,
    'On Hold': tickets.filter(t => t.status === 'On Hold').length,
    Completed: tickets.filter(t => t.status === 'Completed').length,
  };

  const dailyData: ChartData<'line'> = {
    labels: daysInMonth.map(day => format(day, 'MMM d')),
    datasets: [
      {
        label: 'Daily Tickets',
        data: dailyTickets,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const performanceData: ChartData<'bar'> = {
    labels: technicianPerformance.map(tech => tech.name),
    datasets: [
      {
        label: 'Total Completed',
        data: technicianPerformance.map(tech => tech.completed),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Completed On Time',
        data: technicianPerformance.map(tech => tech.onTime),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };

  const statusData: ChartData<'doughnut'> = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(234, 179, 8, 0.5)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(34, 197, 94, 0.5)',
        ],
        borderColor: [
          'rgb(234, 179, 8)',
          'rgb(59, 130, 246)',
          'rgb(249, 115, 22)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tickets</h3>
          <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Technicians</h3>
          <p className="text-3xl font-bold text-blue-600">
            {technicians.filter(t => t.role === 'technician').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completion Rate</h3>
          <p className="text-3xl font-bold text-blue-600">
            {tickets.length ? 
              Math.round((statusCounts.Completed / tickets.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Tickets This Month</h3>
          <Line data={dailyData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Status Distribution</h3>
          <Doughnut data={statusData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom' as const,
              },
            }
          }} />
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Technician Performance</h3>
          <Bar data={performanceData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }} />
        </div>
      </div>
    </div>
  );
};