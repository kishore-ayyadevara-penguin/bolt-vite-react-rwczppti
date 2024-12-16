import React, { useState } from 'react';
import { Trash2, Plus, Save, X } from 'lucide-react';
import { CodeEvidence, SupportingEvidence } from '../types';
import { OCRTextViewer } from './OCRTextViewer';

interface EditableEvidenceProps {
  evidence: CodeEvidence;
  onSave: (updatedEvidence: CodeEvidence | null) => void;
  onCancel: () => void;
  categoryType: string;
  currentPage: number;
}

export function EditableEvidence({ evidence, onSave, onCancel, categoryType, currentPage }: EditableEvidenceProps) {
  const [editedEvidence, setEditedEvidence] = useState<CodeEvidence>({
    ...evidence,
    supportingText: evidence.supportingText.map(text => 
      typeof text === 'string' ? { text, pageNumber: evidence.pageNumbers[0] } : text
    )
  });
  const [newText, setNewText] = useState('');
  const [showOCRText, setShowOCRText] = useState(false);

  const handleTextChange = (index: number, value: string) => {
    const newSupportingText = [...editedEvidence.supportingText];
    newSupportingText[index] = {
      ...newSupportingText[index],
      text: value
    };
    setEditedEvidence({ ...editedEvidence, supportingText: newSupportingText });
  };

  const handlePageChange = (index: number, value: string) => {
    const pageNum = parseInt(value, 10);
    if (!isNaN(pageNum) && pageNum > 0) {
      const newSupportingText = [...editedEvidence.supportingText];
      newSupportingText[index] = {
        ...newSupportingText[index],
        pageNumber: pageNum
      };
      setEditedEvidence({ 
        ...editedEvidence, 
        supportingText: newSupportingText,
        pageNumbers: Array.from(new Set([...editedEvidence.pageNumbers, pageNum]))
      });
    }
  };

  const handleAddText = () => {
    if (newText.trim()) {
      const newEvidence: SupportingEvidence = {
        text: newText.trim(),
        pageNumber: currentPage
      };
      setEditedEvidence({
        ...editedEvidence,
        supportingText: [...editedEvidence.supportingText, newEvidence],
        pageNumbers: Array.from(new Set([...editedEvidence.pageNumbers, currentPage]))
      });
      setNewText('');
    }
  };

  const handleRemoveText = (index: number) => {
    const newSupportingText = editedEvidence.supportingText.filter((_, i) => i !== index);
    const remainingPages = newSupportingText.map(evidence => evidence.pageNumber);
    setEditedEvidence({
      ...editedEvidence,
      supportingText: newSupportingText,
      pageNumbers: Array.from(new Set(remainingPages))
    });
  };

  const handleDelete = () => {
    onSave(null);
  };

  const handleSave = () => {
    if (editedEvidence.supportingText.length > 0) {
      onSave(editedEvidence);
    }
  };

  const handleSelectOCRText = (selectedText: string) => {
    setNewText(selectedText);
    setShowOCRText(false);
  };

  const getCategoryColor = (type: string) => {
    const colors = {
      'missing-hcc': 'text-red-600',
      'current-hcc': 'text-green-600',
      'missed-icd': 'text-yellow-600',
      'potential-visit': 'text-blue-600',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900">{editedEvidence.code}</h4>
          <p className="text-sm text-gray-600">{editedEvidence.description}</p>
        </div>
        <span className={`text-sm font-medium ${getCategoryColor(categoryType)}`}>
          RAF: {editedEvidence.rafValue.toFixed(3)}
        </span>
      </div>

      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">Supporting Evidence:</h5>
        {editedEvidence.supportingText.map((evidence, index) => (
          <div key={index} className="flex items-start space-x-2">
            <div className="flex-1 space-y-2">
              <textarea
                value={evidence.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
                className="w-full text-sm text-gray-600 p-2 border rounded resize-y min-h-[60px]"
              />
              <div className="flex items-center space-x-2">
                <label className="text-xs text-gray-500">Page:</label>
                <input
                  type="number"
                  min="1"
                  value={evidence.pageNumber}
                  onChange={(e) => handlePageChange(index, e.target.value)}
                  className="w-16 text-sm p-1 border rounded"
                />
              </div>
            </div>
            <button
              onClick={() => handleRemoveText(index)}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="relative">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Add new supporting evidence..."
              className="flex-1 p-2 text-sm border rounded"
            />
            <button
              onClick={() => setShowOCRText(true)}
              className="p-2 text-blue-500 hover:text-blue-600"
              title="View OCR Text"
            >
              <Plus className="w-4 h-4" />
            </button>
            {newText && (
              <button
                onClick={handleAddText}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Code</span>
        </button>
        <div className="space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm text-green-600 hover:text-green-700 flex items-center space-x-1"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {showOCRText && (
        <OCRTextViewer
          currentPage={currentPage}
          onClose={() => setShowOCRText(false)}
          onSelect={handleSelectOCRText}
        />
      )}
    </div>
  );
}