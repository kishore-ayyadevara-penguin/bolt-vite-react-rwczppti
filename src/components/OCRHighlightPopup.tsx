import React from 'react';
import { X } from 'lucide-react';

interface OCRHighlightPopupProps {
  pageText: string;
  highlights: Array<{
    text: string;
    start_idx: number;
    end_idx: number;
  }>;
  pageNumber: number;
  onClose: () => void;
}

export function OCRHighlightPopup({ pageText, highlights, pageNumber, onClose }: OCRHighlightPopupProps) {
  const renderHighlightedText = () => {
    let lastIndex = 0;
    const result: React.ReactNode[] = [];

    // Sort highlights by start_idx to process them in order
    const sortedHighlights = [...highlights].sort((a, b) => a.start_idx - b.start_idx);

    sortedHighlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start_idx > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {pageText.slice(lastIndex, highlight.start_idx)}
          </span>
        );
      }

      // Add highlighted text
      result.push(
        <mark key={`highlight-${index}`} className="bg-yellow-200 px-1">
          {pageText.slice(highlight.start_idx, highlight.end_idx)}
        </mark>
      );

      lastIndex = highlight.end_idx;
    });

    // Add remaining text after last highlight
    if (lastIndex < pageText.length) {
      result.push(
        <span key="text-end">
          {pageText.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Clinical Note Context - Page {pageNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none whitespace-pre-wrap text-gray-700 mb-4 p-4 border rounded-lg bg-gray-50 leading-relaxed max-h-[70vh] overflow-y-auto">
            {renderHighlightedText()}
          </div>
        </div>
      </div>
    </div>
  );
}