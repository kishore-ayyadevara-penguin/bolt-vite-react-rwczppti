import React, { useState } from 'react';
import { Edit2, Trash2, Save, X, Search } from 'lucide-react';
import { OCRHighlightPopup } from './OCRHighlightPopup';

interface SupportingSentenceProps {
  text: { 
    text: string; 
    pageNumber: number; 
    start_idx?: number; 
    end_idx?: number 
  };
  pageText?: string;
  onEdit: (newText: string, pageNumber: number) => void;
  onDelete: () => void;
}

export function SupportingSentence({ text, pageText, onEdit, onDelete }: SupportingSentenceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOCRContext, setShowOCRContext] = useState(false);
  const [editedText, setEditedText] = useState(text.text);
  const [editedPage, setEditedPage] = useState(text.pageNumber);

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(editedText, editedPage);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(text.text);
    setEditedPage(text.pageNumber);
    setIsEditing(false);
  };

  const handleShowContext = () => {
    if (pageText && text.start_idx !== undefined && text.end_idx !== undefined) {
      setShowOCRContext(true);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Page:</label>
          <input
            type="number"
            min="1"
            value={editedPage}
            onChange={(e) => setEditedPage(Number(e.target.value))}
            className="w-20 text-sm p-1 border rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-green-600 hover:text-green-700"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    );
  }

  const canShowContext = pageText && text.start_idx !== undefined && text.end_idx !== undefined;

  return (
    <>
      <div className="group relative bg-blue-50 p-3 rounded-md border border-blue-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-700">{text.text}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                Page {text.pageNumber}
              </span>
              <div className="flex items-center space-x-1">
                {canShowContext && (
                  <button
                    onClick={handleShowContext}
                    className="p-1 text-gray-500 hover:text-blue-600 rounded"
                    title="View in Context"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:text-blue-600 rounded"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 text-gray-500 hover:text-red-600 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showOCRContext && pageText && text.start_idx !== undefined && text.end_idx !== undefined && (
        <OCRHighlightPopup
          pageText={pageText}
          highlights={[{
            text: text.text,
            start_idx: text.start_idx,
            end_idx: text.end_idx
          }]}
          pageNumber={text.pageNumber}
          onClose={() => setShowOCRContext(false)}
        />
      )}
    </>
  );
}