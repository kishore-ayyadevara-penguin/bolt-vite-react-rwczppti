import React, { useState } from 'react';
import { SupportingSentence } from './SupportingSentence';
import { AddEvidenceButton } from './AddEvidenceButton';
import { OCRTextSelector } from './OCRTextSelector';
import { CodeEvidence } from '../types';

interface CodeEvidenceCardProps {
  evidence: CodeEvidence;
  pageWiseOCR?: Record<string, string>;
  onUpdateEvidence: (updatedEvidence: CodeEvidence) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function CodeEvidenceCard({ 
  evidence, 
  pageWiseOCR, 
  onUpdateEvidence,
  currentPage,
  onPageChange
}: CodeEvidenceCardProps) {
  const [showOCRSelector, setShowOCRSelector] = useState(false);

  const handleAddEvidence = (text: string, pageNumber: number, startIdx: number, endIdx: number) => {
    const newEvidence = {
      text,
      pageNumber,
      start_idx: startIdx,
      end_idx: endIdx
    };

    onUpdateEvidence({
      ...evidence,
      supportingText: [...evidence.supportingText, newEvidence],
      pageNumbers: Array.from(new Set([...evidence.pageNumbers, pageNumber]))
    });

    setShowOCRSelector(false);
  };

  const handleEditText = (index: number, newText: string, pageNumber: number) => {
    const updatedSupportingText = [...evidence.supportingText];
    updatedSupportingText[index] = { 
      ...updatedSupportingText[index],
      text: newText,
      pageNumber
    };
    
    onUpdateEvidence({
      ...evidence,
      supportingText: updatedSupportingText,
      pageNumbers: Array.from(new Set(updatedSupportingText.map(text => 
        typeof text === 'string' ? 1 : text.pageNumber
      )))
    });
  };

  const handleDeleteText = (index: number) => {
    const updatedSupportingText = evidence.supportingText.filter((_, i) => i !== index);
    
    onUpdateEvidence({
      ...evidence,
      supportingText: updatedSupportingText,
      pageNumbers: Array.from(new Set(updatedSupportingText.map(text => 
        typeof text === 'string' ? 1 : text.pageNumber
      )))
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Supporting Evidence</span>
      </div>
      
      {evidence.supportingText.map((text, index) => (
        <SupportingSentence
          key={index}
          text={typeof text === 'string' ? { text, pageNumber: 1 } : text}
          pageText={pageWiseOCR?.[typeof text === 'string' ? '1' : text.pageNumber.toString()]}
          onEdit={(newText, pageNumber) => handleEditText(index, newText, pageNumber)}
          onDelete={() => handleDeleteText(index)}
          onPageChange={onPageChange}
        />
      ))}

      {pageWiseOCR && (
        <AddEvidenceButton onClick={() => setShowOCRSelector(true)} />
      )}

      {showOCRSelector && pageWiseOCR && (
        <OCRTextSelector
          pageWiseOCR={pageWiseOCR}
          currentPage={currentPage}
          onClose={() => setShowOCRSelector(false)}
          onSelect={handleAddEvidence}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}