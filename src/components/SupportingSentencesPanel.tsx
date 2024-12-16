import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { DocumentCategory, CodeEvidence } from '../types';
import { CodeEvidenceCard } from './CodeEvidenceCard';
import { AddHCCModal } from './AddHCCModal';

interface SupportingSentencesPanelProps {
  categories: DocumentCategory[];
  pageWiseOCR?: Record<string, string>;
  onUpdateCategory: (categoryIndex: number, codeIndex: number, updatedEvidence: CodeEvidence) => void;
  onAddHCC: (category: DocumentCategory['type'], code: CodeEvidence) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function SupportingSentencesPanel({ 
  categories, 
  pageWiseOCR,
  onUpdateCategory, 
  onAddHCC,
  currentPage,
  onPageChange
}: SupportingSentencesPanelProps) {
  const [showAddHCC, setShowAddHCC] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const toggleCodeExpansion = (code: string) => {
    setExpandedCode(expandedCode === code ? null : code);
  };

  return (
    <div className="w-96 border-l overflow-y-auto bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Supporting Evidence</h3>
        <button
          onClick={() => setShowAddHCC(true)}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 rounded-md hover:bg-green-50"
        >
          <Plus className="w-4 h-4" />
          <span>Add HCC</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-3">
            {category.codes.map((code, codeIndex) => (
              <div key={`${categoryIndex}-${codeIndex}`} 
                   className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCodeExpansion(code.code)}
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{code.code}</h4>
                    <p className="text-sm text-gray-600">{code.description}</p>
                  </div>
                  {expandedCode === code.code ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {expandedCode === code.code && (
                  <div className="mt-3 space-y-2">
                    <CodeEvidenceCard
                      evidence={code}
                      pageWiseOCR={pageWiseOCR}
                      onUpdateEvidence={(updatedEvidence) => {
                        onUpdateCategory(categoryIndex, codeIndex, updatedEvidence);
                      }}
                      currentPage={currentPage}
                      onPageChange={onPageChange}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showAddHCC && (
        <AddHCCModal
          onClose={() => setShowAddHCC(false)}
          onAdd={onAddHCC}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}