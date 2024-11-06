import React from 'react';
import { AuditLog } from '../../types';
import { History } from 'lucide-react';

interface AuditLogProps {
  logs: AuditLog[];
}

export const AuditLogComponent: React.FC<AuditLogProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <History className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {logs.map((log, idx) => (
              <li key={log.id}>
                <div className="relative pb-8">
                  {idx !== logs.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                        <History className="h-5 w-5 text-gray-500" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">{log.details}</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};