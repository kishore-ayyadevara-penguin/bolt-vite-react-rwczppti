import React from 'react';
import { Users, Building2 } from 'lucide-react';

interface ViewToggleProps {
  view: 'member' | 'provider';
  onViewChange: (view: 'member' | 'provider') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex justify-end mb-4">
      <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center">
        <button
          onClick={() => onViewChange('member')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            view === 'member'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Member View</span>
        </button>
        <button
          onClick={() => onViewChange('provider')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            view === 'provider'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Provider View</span>
        </button>
      </div>
    </div>
  );
}