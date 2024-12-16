import React from 'react';
import { MemberRAFImprovement } from '../../types';
import { generateMemberId } from '../../utils/memberUtils';

interface RowProps {
  improvement: MemberRAFImprovement;
  onClick: () => void;
  onFilter: (type: 'facility' | 'provider' | 'member', value: string) => void;
  isClickable: boolean;
}

function Headers() {
  return (
    <tr className="bg-gray-50">
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-24">Member ID</th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Facility</th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Provider</th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Member</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">Current RAF</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">Total Potential</th>
    </tr>
  );
}

function Row({ improvement, onClick, onFilter, isClickable }: RowProps) {
  const memberId = generateMemberId(improvement.name);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{memberId}</td>
      <td 
        className={`px-4 py-3 text-sm ${isClickable ? 'text-blue-600 hover:text-blue-800 cursor-pointer' : 'text-gray-900'}`}
        onClick={() => isClickable && onFilter('facility', improvement.facility)}
      >
        {improvement.facility}
      </td>
      <td 
        className={`px-4 py-3 text-sm ${isClickable ? 'text-blue-600 hover:text-blue-800 cursor-pointer' : 'text-gray-900'}`}
        onClick={() => isClickable && onFilter('provider', improvement.provider)}
      >
        {improvement.provider}
      </td>
      <td 
        className={`px-4 py-3 text-sm ${isClickable ? 'text-blue-600 hover:text-blue-800 cursor-pointer' : 'text-gray-900'}`}
        onClick={() => isClickable && onFilter('member', improvement.name)}
      >
        {improvement.name}
      </td>
      <td className="px-4 py-3 text-sm text-right text-gray-600">
        {improvement.currentHCCValue.toFixed(3)}
      </td>
      <td className="px-4 py-3 text-sm text-right text-purple-600 font-semibold">
        +{improvement.totalPotentialImprovement.toFixed(3)}
      </td>
    </tr>
  );
}

export const ProviderView = {
  Headers,
  Row
};