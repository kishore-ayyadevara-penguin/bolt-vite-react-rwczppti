import React, { useState, useEffect, useCallback } from 'react';
import { X, Check } from 'lucide-react';

interface OCRTextViewerProps {
  currentPage: number;
  onClose: () => void;
  onSelect: (selectedText: string) => void;
}

export function OCRTextViewer({ currentPage, onClose, onSelect }: OCRTextViewerProps) {
  const [selectedText, setSelectedText] = useState('');

  // Simulated OCR text - replace with actual API call later
  const mockOCRText = `Patient History:
Diabetes mellitus type 2 (E11.9) - Diagnosed 5 years ago
- Current A1C: 8.2% (elevated)
- On Metformin 1000mg BID
- Shows signs of early nephropathy

Cardiovascular:
- Hypertension (I10) - Well-controlled on medication
- Recent ECG shows normal sinus rhythm
- No signs of CHF

Assessment:
1. Diabetes with increasing complexity
2. Hypertension - stable
3. Early diabetic nephropathy

Plan:
- Adjust diabetes medication
- Continue current HTN management
- Schedule nephrology consult
- Follow-up in 3 months`;

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  const handleAddSelection = () => {
    if (selectedText) {
      onSelect(selectedText);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Select Text from Page {currentPage}
          </h3>
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
            className="prose max-w-none whitespace-pre-wrap text-gray-700 mb-4 p-4 border rounded-lg bg-gray-50"
            style={{ userSelect: 'text' }}
          >
            {mockOCRText}
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
                <span>Use Selection</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}