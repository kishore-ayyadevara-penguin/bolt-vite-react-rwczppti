import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, FileText } from 'lucide-react';
import { ActionItem, NurseViewData } from '../types';

interface NurseViewProps {
  data: NurseViewData;
}

export function NurseView({ data }: NurseViewProps) {
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [scheduledDates, setScheduledDates] = useState<Record<string, string>>({});

  const handleSchedule = (memberId: string, date: string) => {
    setScheduledDates(prev => ({
      ...prev,
      [memberId]: date
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'scheduled': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const renderActionList = () => (
    <div className="space-y-4">
      {data.actionItems.map((item) => (
        <div
          key={item.memberId}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedItem(item)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">ID: {item.memberId}</p>
              </div>
              <div className="flex items-center space-x-2">
                {item.type === 'poc' ? (
                  <FileText className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Calendar className="w-5 h-5 text-blue-500" />
                )}
                <span className="text-sm font-medium">
                  {item.type === 'poc' ? 'Plan of Care Required' : 'Annual Wellness Visit'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {item.codes.map((code, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{code.code} - {code.description}</span>
                  <span className={`font-medium ${getStatusColor(code.status)}`}>
                    {code.status === 'scheduled' && code.scheduledDate ? (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(code.scheduledDate).toLocaleDateString()}</span>
                      </span>
                    ) : code.status === 'completed' ? (
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      'Pending'
                    )}
                  </span>
                </div>
              ))}
            </div>

            {scheduledDates[item.memberId] && (
              <div className="mt-3 text-sm text-blue-600">
                Scheduled for: {scheduledDates[item.memberId]}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderDetailView = () => {
    if (!selectedItem) return null;

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
            <p className="text-gray-600">Member ID: {selectedItem.memberId}</p>
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            Back to List
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {selectedItem.type === 'poc' ? 'Required Plan of Care' : 'Annual Wellness Visit Required'}
            </h3>
            <div className="space-y-4">
              {selectedItem.codes.map((code, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{code.code}</p>
                      <p className="text-sm text-gray-600">{code.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      code.status === 'completed' ? 'bg-green-100 text-green-800' :
                      code.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {code.status.charAt(0).toUpperCase() + code.status.slice(1)}
                    </span>
                  </div>

                  {code.status !== 'completed' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule Visit
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => handleSchedule(selectedItem.memberId, e.target.value)}
                        />
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => {
                            // Handle scheduling logic
                            alert('Visit scheduled successfully!');
                          }}
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  )}

                  {code.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{code.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Action Items</h1>
        <p className="text-gray-600">Manage patient visits and care plans</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {selectedItem ? renderDetailView() : renderActionList()}
      </div>
    </div>
  );
}