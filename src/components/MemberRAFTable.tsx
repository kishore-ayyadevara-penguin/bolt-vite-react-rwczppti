import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ViewToggle } from './ViewToggle';
import { MemberView } from './tables/MemberView';
import { ProviderView } from './tables/ProviderView';
import { TableFooter } from './tables/TableFooter';
import { PDFViewer } from './PDFViewer';
import { FilterBreadcrumb } from './FilterBreadcrumb';
import { MemberRAFImprovement } from '../types';

interface FilterLevel {
  type: 'facility' | 'provider' | 'member';
  value: string;
}

interface MemberRAFTableProps {
  improvements: MemberRAFImprovement[];
  onRAFUpdate: (filteredImprovements: MemberRAFImprovement[]) => void;
}

export function MemberRAFTable({ improvements, onRAFUpdate }: MemberRAFTableProps) {
  const [selectedMember, setSelectedMember] = useState<MemberRAFImprovement | null>(null);
  const [view, setView] = useState<'member' | 'provider'>('member');
  const [filters, setFilters] = useState<FilterLevel[]>([]);
  const [savedFilters, setSavedFilters] = useState<FilterLevel[]>([]);

  // Memoize filtered data calculation
  const filteredData = useMemo(() => {
    const activeFilters = view === 'provider' ? filters : [];
    return activeFilters.reduce((data, filter) => {
      return data.filter(item => item[filter.type] === filter.value);
    }, improvements);
  }, [filters, improvements, view]);

  // Update RAF calculations when filtered data changes
  useEffect(() => {
    if (view === 'provider') {
      onRAFUpdate(filteredData);
    } else {
      onRAFUpdate(improvements);
    }
  }, [filteredData, improvements, onRAFUpdate, view]);

  const handleViewChange = useCallback((newView: 'member' | 'provider') => {
    setView(newView);
    if (newView === 'member') {
      setSavedFilters(filters);
      setFilters([]);
    } else {
      setFilters(savedFilters);
    }
  }, [filters, savedFilters]);

  const handleFilter = useCallback((type: 'facility' | 'provider' | 'member', value: string) => {
    const canApplyFilter = type === 'facility' || 
      (type === 'provider' && filters.some(f => f.type === 'facility')) ||
      (type === 'member' && filters.some(f => f.type === 'provider'));

    if (!canApplyFilter) return;

    setFilters(prevFilters => {
      const filterIndex = prevFilters.findIndex(f => f.type === type);
      if (filterIndex >= 0) {
        return [...prevFilters.slice(0, filterIndex), { type, value }];
      }
      return [...prevFilters, { type, value }];
    });
  }, [filters]);

  const clearFilter = useCallback((level: number) => {
    setFilters(prevFilters => prevFilters.slice(0, level));
  }, []);

  const handleCellClick = useCallback((improvement: MemberRAFImprovement) => {
    if (improvement.documents?.length > 0) {
      setSelectedMember(improvement);
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Member RAF Improvement Opportunities</h2>
        <ViewToggle view={view} onViewChange={handleViewChange} />
      </div>

      {view === 'provider' && filters.length > 0 && (
        <FilterBreadcrumb
          filters={filters}
          onClearFilter={clearFilter}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {view === 'provider' ? (
              <ProviderView.Headers />
            ) : (
              <MemberView.Headers />
            )}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((improvement) => (
              view === 'provider' ? (
                <ProviderView.Row
                  key={`${improvement.facility}-${improvement.provider}-${improvement.memberId}`}
                  improvement={improvement}
                  onClick={() => handleCellClick(improvement)}
                  onFilter={handleFilter}
                  isClickable={filters.length < 3}
                />
              ) : (
                <MemberView.Row
                  key={improvement.memberId}
                  improvement={improvement}
                  onClick={() => handleCellClick(improvement)}
                />
              )
            ))}
          </tbody>
          <TableFooter improvements={filteredData} view={view} />
        </table>
      </div>

      {selectedMember && (
        <PDFViewer
          documents={selectedMember.documents}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}