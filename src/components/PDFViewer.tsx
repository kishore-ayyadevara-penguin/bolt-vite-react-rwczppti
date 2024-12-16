import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { MemberDocument, DocumentCategory, CodeEvidence } from '../types';
import { EditableEvidence } from './EditableEvidence';
import { SupportingSentencesPanel } from './SupportingSentencesPanel';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  documents: MemberDocument[];
  onClose: () => void;
}

export function PDFViewer({ documents, onClose }: PDFViewerProps) {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleUpdateCategory = (categoryIndex: number, codeIndex: number, updatedEvidence: CodeEvidence) => {
    const updatedDoc = { ...selectedDoc };
    updatedDoc.categories[categoryIndex].codes[codeIndex] = updatedEvidence;
    setSelectedDoc(updatedDoc);
    setHasUnsavedChanges(true);
  };

  const handleAddHCC = (categoryType: DocumentCategory['type'], newCode: CodeEvidence) => {
    const updatedDoc = { ...selectedDoc };
    const categoryIndex = updatedDoc.categories.findIndex(cat => cat.type === categoryType);
    
    if (categoryIndex === -1) {
      updatedDoc.categories.push({
        type: categoryType,
        codes: [newCode]
      });
    } else {
      updatedDoc.categories[categoryIndex].codes.push(newCode);
    }
    
    setSelectedDoc(updatedDoc);
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving annotations for document:', selectedDoc);
      setHasUnsavedChanges(false);
      alert('Annotations saved successfully!');
    } catch (error) {
      console.error('Failed to save annotations:', error);
      alert('Failed to save annotations. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentChange = (doc: MemberDocument) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('You have unsaved changes. Are you sure you want to switch documents?');
      if (!confirmChange) return;
    }
    setSelectedDoc(doc);
    setPageNumber(1);
    setHasUnsavedChanges(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!numPages || newPage <= numPages)) {
      setPageNumber(newPage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full max-w-[95vw] max-h-[90vh] rounded-lg flex">
        {/* Document List */}
        <div className="w-64 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Documents</h3>
          </div>
          <div className="space-y-1 p-2">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentChange(doc)}
                className={`w-full text-left p-3 rounded-lg text-sm ${
                  selectedDoc.id === doc.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="font-medium">{doc.title}</div>
                <div className="text-xs text-gray-500">{doc.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber <= 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {pageNumber} of {numPages || '...'}
              </span>
              <button
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={!numPages || pageNumber >= numPages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubmit}
                disabled={!hasUnsavedChanges || isSaving}
                className={`px-4 py-2 rounded text-sm flex items-center space-x-2 ${
                  hasUnsavedChanges
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Annotations'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex min-h-0">
            {/* PDF Document */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <div className="mx-auto max-w-3xl bg-white shadow-lg">
                <Document
                  file={selectedDoc.url}
                  onLoadSuccess={handleDocumentLoadSuccess}
                  loading={
                    <div className="flex justify-center items-center h-96">
                      <div className="animate-pulse text-gray-400">Loading PDF...</div>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={800}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </Document>
              </div>
            </div>

            {/* Supporting Sentences Panel */}
            <SupportingSentencesPanel 
              categories={selectedDoc.categories}
              pageWiseOCR={selectedDoc.page_wise_ocr}
              onUpdateCategory={handleUpdateCategory}
              onAddHCC={handleAddHCC}
              currentPage={pageNumber}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}