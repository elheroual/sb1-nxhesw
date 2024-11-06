import React from 'react';
import { PerformanceMetrics, User } from '../types';
import { BarChart, Users, Clock, CheckCircle } from 'lucide-react';

interface AdminPanelProps {
  metrics: PerformanceMetrics[];
  technicians: User[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ metrics, technicians }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.technician} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{metric.technician}</h3>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed Tickets</span>
                <span className="font-semibold">{metric.completedTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Resolution Time</span>
                <span className="font-semibold">{metric.averageResolutionTime}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">On-Time Completion</span>
                <span className="font-semibold">{metric.onTimeCompletion}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Overview</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Chart placeholder - Would implement with a charting library</span>
          </div>
        </div>
      </div>
    </div>
  );
};