import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { CodeEvidence, DocumentCategory } from '../types';

interface AddHCCModalProps {
  onClose: () => void;
  onAdd: (category: DocumentCategory['type'], code: CodeEvidence) => void;
  currentPage: number;
}

export function AddHCCModal({ onClose, onAdd, currentPage }: AddHCCModalProps) {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory['type']>('missing-hcc');
  const [rafValue, setRafValue] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCode: CodeEvidence = {
      code,
      description,
      rafValue: parseFloat(rafValue) || 0,
      supportingText: [],
      pageNumbers: []
    };

    onAdd(category, newCode);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add New HCC Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory['type'])}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="missing-hcc">Missing HCC</option>
              <option value="current-hcc">Current HCC</option>
              <option value="missed-icd">Missed ICD</option>
              <option value="potential-visit">Visit Potential</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., HCC001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter code description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RAF Value
            </label>
            <input
              type="number"
              value={rafValue}
              onChange={(e) => setRafValue(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              step="0.001"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add HCC Code</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}