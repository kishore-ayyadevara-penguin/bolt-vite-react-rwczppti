import React from 'react';
import { HCCCode, ICDCode, Patient } from '../types';

interface DetailsListProps {
  data: (HCCCode | ICDCode | Patient)[];
  type: 'hcc' | 'icd' | 'patient';
}

export function DetailsList({ data, type }: DetailsListProps) {
  const renderHCCItem = (item: HCCCode) => (
    <div className="p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">{item.code}</p>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
        <span className="text-sm text-gray-500">Year: {item.year}</span>
      </div>
    </div>
  );

  const renderICDItem = (item: ICDCode) => (
    <div className="p-4 bg-white rounded-lg shadow mb-2">
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-semibold text-gray-800">{item.code}</p>
          <span className="text-sm text-yellow-500">Missing Plan of Action</span>
        </div>
        <p className="text-sm text-gray-600">{item.description}</p>
        <p className="text-sm text-blue-600">Potential HCC: {item.potentialHCC}</p>
      </div>
    </div>
  );

  const renderPatientItem = (item: Patient) => (
    <div className="p-4 bg-white rounded-lg shadow mb-2">
      <div className="space-y-2">
        <p className="font-semibold text-gray-800">{item.name}</p>
        <p className="text-sm text-gray-600">Last Visit: {item.lastVisit}</p>
        <div className="flex flex-wrap gap-2">
          {item.eligibleConditions.map((condition, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
            >
              {condition}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>
          {type === 'hcc' && renderHCCItem(item as HCCCode)}
          {type === 'icd' && renderICDItem(item as ICDCode)}
          {type === 'patient' && renderPatientItem(item as Patient)}
        </div>
      ))}
    </div>
  );
}