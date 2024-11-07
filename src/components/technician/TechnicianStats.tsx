import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Ticket } from '../../types';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isPast, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TechnicianStatsProps {
  tickets: Ticket[];
  technicianName: string;
}

export const TechnicianStats: React.FC<TechnicianStatsProps> = ({ tickets, technicianName }) => {
  const technicianTickets = tickets.filter(ticket => ticket.technician === technicianName);
  
  // Calculate daily tickets for current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const dailyTickets = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return technicianTickets.filter(ticket => 
      ticket.createdAt.split('T')[0] === dayStr
    ).length;
  });

  // Calculate deadline statistics
  const completedTickets = technicianTickets.filter(ticket => ticket.status === 'Completed');
  const beforeDeadline = completedTickets.filter(ticket => 
    !isPast(parseISO(ticket.dueDate)) || 
    new Date(ticket.updatedAt) <= parseISO(ticket.dueDate)
  ).length;
  const afterDeadline = completedTickets.length - beforeDeadline;

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

  const deadlineData: ChartData<'bar'> = {
    labels: ['Before Deadline', 'After Deadline'],
    datasets: [
      {
        label: 'Completed Tickets',
        data: [beforeDeadline, afterDeadline],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
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
          <p className="text-3xl font-bold text-blue-600">{technicianTickets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
          <p className="text-3xl font-bold text-green-600">
            {completedTickets.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">On Time Completion</h3>
          <p className="text-3xl font-bold text-blue-600">
            {completedTickets.length ? 
              Math.round((beforeDeadline / completedTickets.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deadline Performance</h3>
          <Bar data={deadlineData} options={{
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