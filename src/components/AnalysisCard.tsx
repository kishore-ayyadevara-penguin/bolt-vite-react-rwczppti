import React from 'react';
import { AlertCircle, CheckCircle, FileWarning, UserCog } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  count: number;
  type: 'missing' | 'current' | 'missed' | 'patients';
  onClick: () => void;
}

export function AnalysisCard({ title, count, type, onClick }: AnalysisCardProps) {
  const icons = {
    missing: AlertCircle,
    current: CheckCircle,
    missed: FileWarning,
    patients: UserCog,
  };

  const colors = {
    missing: 'text-red-500',
    current: 'text-green-500',
    missed: 'text-yellow-500',
    patients: 'text-blue-500',
  };

  const Icon = icons[type];

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Icon className={`w-8 h-8 ${colors[type]}`} />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-3xl font-bold mt-2">{count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}