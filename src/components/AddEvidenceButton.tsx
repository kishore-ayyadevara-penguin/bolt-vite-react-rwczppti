import React from 'react';
import { Plus } from 'lucide-react';

interface AddEvidenceButtonProps {
  onClick: () => void;
}

export function AddEvidenceButton({ onClick }: AddEvidenceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 border border-dashed border-blue-300 hover:border-blue-400 rounded-md hover:bg-blue-50 transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span>Add Supporting Evidence</span>
    </button>
  );
}