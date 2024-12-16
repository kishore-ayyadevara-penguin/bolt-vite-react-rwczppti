import React, { useState } from 'react';
import { MemberRAFImprovement } from '../types';
import { PDFViewer } from './PDFViewer';
import { Phone, Calendar, FileText, CheckCircle, AlertCircle, ClipboardList } from 'lucide-react';

interface NurseActionViewProps {
  improvements: MemberRAFImprovement[];
}

export function NurseActionView({ improvements }: NurseActionViewProps) {
  const [selectedMember, setSelectedMember] = useState<MemberRAFImprovement | null>(null);
  const [contactStatus, setContactStatus] = useState<Record<string, 'pending' | 'contacted' | 'scheduled'>>({});

  const membersNeedingAction = improvements.filter(
    member => member.droppedHCCValue > 0 || member.missedICDImprovement > 0
  );

  const handleContactStatus = (memberId: string, status: 'pending' | 'contacted' | 'scheduled') => {
    setContactStatus(prev => ({
      ...prev,
      [memberId]: status
    }));
  };

  const getStatusColor = (status: 'pending' | 'contacted' | 'scheduled' | undefined) => {
    switch (status) {
      case 'scheduled': return 'text-green-600';
      case 'contacted': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: 'pending' | 'contacted' | 'scheduled' | undefined) => {
    switch (status) {
      case 'scheduled': return <CheckCircle className="w-5 h-5" />;
      case 'contacted': return <Phone className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Mock data for demonstration - replace with actual data from API
  const getMemberConditions = (memberId: string) => ({
    droppedHCCs: [
      { code: 'HCC108', description: 'Vascular Disease', lastDocumented: '2022-12-15' },
      { code: 'HCC18', description: 'Diabetes with Chronic Complications', lastDocumented: '2022-11-30' }
    ],
    missingPOC: [
      { code: 'I50.22', description: 'Chronic systolic (congestive) heart failure', status: 'Needs Documentation' },
      { code: 'E11.22', description: 'Type 2 diabetes mellitus with diabetic chronic kidney disease', status: 'Needs Documentation' }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Care Management Actions Required</h2>
        
        <div className="space-y-6">
          {membersNeedingAction.map((member) => {
            const conditions = getMemberConditions(member.memberId);
            
            return (
              <div key={member.memberId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">ID: {member.memberId}</p>
                  </div>
                  <div className={`flex items-center space-x-2 ${getStatusColor(contactStatus[member.memberId])}`}>
                    {getStatusIcon(contactStatus[member.memberId])}
                    <span className="text-sm font-medium">
                      {contactStatus[member.memberId] || 'Action Required'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {conditions.droppedHCCs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-red-600 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Conditions Requiring Follow-up
                      </h4>
                      <div className="space-y-2">
                        {conditions.droppedHCCs.map((condition, idx) => (
                          <div key={idx} className="p-3 bg-red-50 rounded-lg">
                            <p className="font-medium text-gray-900">{condition.code}</p>
                            <p className="text-sm text-gray-600">{condition.description}</p>
                            <p className="text-xs text-red-600 mt-1">
                              Last documented: {condition.lastDocumented}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {conditions.missingPOC.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-yellow-600 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Conditions Needing Care Plan
                      </h4>
                      <div className="space-y-2">
                        {conditions.missingPOC.map((condition, idx) => (
                          <div key={idx} className="p-3 bg-yellow-50 rounded-lg">
                            <p className="font-medium text-gray-900">{condition.code}</p>
                            <p className="text-sm text-gray-600">{condition.description}</p>
                            <p className="text-xs text-yellow-600 mt-1">{condition.status}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Clinical Notes</span>
                  </button>
                  <button
                    onClick={() => handleContactStatus(member.memberId, 'contacted')}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Mark Contacted</span>
                  </button>
                  <button
                    onClick={() => handleContactStatus(member.memberId, 'scheduled')}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule Visit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedMember && (
        <PDFViewer
          documents={selectedMember.documents}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}