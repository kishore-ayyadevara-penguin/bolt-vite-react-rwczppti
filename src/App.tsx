import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { AnalysisCard } from './components/AnalysisCard';
import { DetailsList } from './components/DetailsList';
import { RAFOverview } from './components/RAFOverview';
import { MemberRAFTable } from './components/MemberRAFTable';
import { NurseActionView } from './components/NurseActionView';
import { LoadingState } from './components/LoadingState';
import { analyzeClinicalNotes } from './utils/analysisUtils';
import { AnalysisResults, UserRole, MemberRAFImprovement } from './types';
import { UserCog, FileText } from 'lucide-react';
import { calculateTotalRAF } from './utils/rafCalculations';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('coder');
  const [rafScores, setRAFScores] = useState<AnalysisResults['rafScores'] | null>(null);

  const handleFilesSelected = async (files: FileList) => {
    setIsAnalyzing(true);
    try {
      const analysisResults = await analyzeClinicalNotes(files);
      setResults(analysisResults);
      setRAFScores(analysisResults.rafScores);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRAFUpdate = useCallback((filteredImprovements: MemberRAFImprovement[]) => {
    const newScores = calculateTotalRAF(filteredImprovements);
    setRAFScores(newScores);
  }, []);

  const toggleRole = () => {
    setUserRole(prev => prev === 'coder' ? 'nurse' : 'coder');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            HCC Code Extraction
          </h1>
          {results && (
            <button
              onClick={toggleRole}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {userRole === 'coder' ? (
                <>
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>Switch to Care Manager View</span>
                </>
              ) : (
                <>
                  <UserCog className="w-5 h-5 text-green-500" />
                  <span>Switch to Coding View</span>
                </>
              )}
            </button>
          )}
        </div>

        {!results && !isAnalyzing && (
          <div className="max-w-3xl mx-auto">
            <FileUpload onFilesSelected={handleFilesSelected} />
          </div>
        )}

        {isAnalyzing && <LoadingState />}

        {results && !activeView && (
          userRole === 'coder' ? (
            <>
              {rafScores && <RAFOverview scores={rafScores} />}
              <MemberRAFTable 
                improvements={results.memberImprovements}
                onRAFUpdate={handleRAFUpdate}
              />
            </>
          ) : (
            <NurseActionView improvements={results.memberImprovements} />
          )
        )}
      </div>
    </div>
  );
}

export default App;