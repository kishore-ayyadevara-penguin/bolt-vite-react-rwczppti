import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

interface OCRTextSelectorProps {
  pageWiseOCR: Record<string, string>;
  currentPage: number;
  onClose: () => void;
  onSelect: (text: string, pageNumber: number, startIdx: number, endIdx: number) => void;
  onPageChange: (page: number) => void;
}

export function OCRTextSelector({ 
  pageWiseOCR, 
  currentPage, 
  onClose, 
  onSelect,
  onPageChange 
}: OCRTextSelectorProps) {
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [pageText, setPageText] = useState('');

  useEffect(() => {
    const text = pageWiseOCR[currentPage.toString()] || '';
    setPageText(text);
  }, [pageWiseOCR, currentPage]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const container = range.startContainer.parentElement;
      if (container?.classList.contains('ocr-text')) {
        const text = selection.toString().trim();
        const fullText = container.textContent || '';
        const start = fullText.indexOf(text);
        const end = start + text.length;
        
        if (start !== -1) {
          setSelectedText(text);
          setSelectionRange({ start, end });
        }
      }
    }
  };

  const handleAddSelection = () => {
    if (selectedText && selectionRange) {
      onSelect(selectedText, currentPage, selectionRange.start, selectionRange.end);
    }
  };

  const totalPages = Object.keys(pageWiseOCR).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Supporting Evidence
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4 text-sm text-gray-600">
            Select text by highlighting it with your mouse
          </div>
          
          <div 
            className="ocr-text prose max-w-none whitespace-pre-wrap text-gray-700 mb-4 p-4 border rounded-lg bg-gray-50 leading-relaxed max-h-[60vh] overflow-y-auto"
            onMouseUp={handleTextSelection}
          >
            {pageText}
          </div>

          {selectedText && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex-1 mr-4">
                <p className="text-sm text-gray-600">Selected text:</p>
                <p className="text-sm font-medium text-gray-900">{selectedText}</p>
              </div>
              <button
                onClick={handleAddSelection}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                <Check className="w-4 h-4" />
                <span>Add Evidence</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}