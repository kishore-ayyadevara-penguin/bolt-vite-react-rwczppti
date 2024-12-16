import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      <div className="text-lg text-gray-600">Analyzing clinical notes...</div>
      <div className="text-sm text-gray-400">This may take a few moments</div>
    </div>
  );
}