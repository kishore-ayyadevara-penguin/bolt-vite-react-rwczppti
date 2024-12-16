import React from 'react';
import { ChevronRight, X } from 'lucide-react';

interface FilterLevel {
  type: 'facility' | 'provider' | 'member';
  value: string;
}

interface FilterBreadcrumbProps {
  filters: FilterLevel[];
  onClearFilter: (level: number) => void;
}

export function FilterBreadcrumb({ filters, onClearFilter }: FilterBreadcrumbProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg mb-4 overflow-x-auto">
      {filters.map((filter, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
          <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-md shadow-sm">
            <span className="text-sm text-gray-600">
              {filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}:
            </span>
            <span className="text-sm font-medium text-blue-600">{filter.value}</span>
            <button
              onClick={() => onClearFilter(index)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}