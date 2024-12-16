import React from 'react';
import { MemberRAFImprovement } from '../../types';
import { generateMemberId } from '../../utils/memberUtils';

function Headers() {
  return (
    <tr className="bg-gray-50">
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-24">Member ID</th>
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Member</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">Current RAF</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">AI Delta RAF</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">Dropped HCCs</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">Missing POC</th>
      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 w-28">Total Potential</th>
    </tr>
  );
}

interface RowProps {
  improvement: MemberRAFImprovement;
  onClick: () => void;
}

function Row({ improvement, onClick }: RowProps) {
  const memberId = generateMemberId(improvement.name);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900">{memberId}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{improvement.name}</td>
      <td className="px-4 py-3 text-sm text-right text-gray-600">
        {improvement.currentHCCValue.toFixed(3)}
      </td>
      <td
        className="px-4 py-3 text-sm text-right text-blue-600 cursor-pointer hover:text-blue-500"
        onClick={onClick}
      >
        +{improvement.aiIdentifiedRAF.toFixed(3)}
      </td>
      <td
        className="px-4 py-3 text-sm text-right text-red-600 cursor-pointer hover:text-red-500"
        onClick={onClick}
      >
        -{improvement.droppedHCCValue.toFixed(3)}
      </td>
      <td
        className="px-4 py-3 text-sm text-right cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-end space-x-1">
          <span className="text-yellow-600">+{improvement.missedICDImprovement.toFixed(3)}</span>
          <span className="text-xs text-gray-500">(POC)</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600">
        +{improvement.totalPotentialImprovement.toFixed(3)}
      </td>
    </tr>
  );
}

export const MemberView = {
  Headers,
  Row
};