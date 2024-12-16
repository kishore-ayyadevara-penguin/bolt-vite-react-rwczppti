import React from 'react';
import { MemberRAFImprovement } from '../../types';
import { calculateMemberAverages } from '../../utils/memberUtils';

interface TableFooterProps {
  improvements: MemberRAFImprovement[];
  view: 'member' | 'provider';
}

export function TableFooter({ improvements, view }: TableFooterProps) {
  const averages = calculateMemberAverages(improvements);
  if (!averages) return null;

  if (view === 'provider') {
    return (
      <tfoot className="bg-gray-50">
        <tr>
          <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-900">Average RAF</td>
          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-600">
            {averages.currentRAF.toFixed(3)}
          </td>
          <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600">
            +{averages.totalPotential.toFixed(3)}
          </td>
        </tr>
      </tfoot>
    );
  }

  return (
    <tfoot className="bg-gray-50">
      <tr>
        <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-gray-900">Average RAF</td>
        <td className="px-4 py-3 text-sm text-right font-semibold text-gray-600">
          {averages.currentRAF.toFixed(3)}
        </td>
        <td className="px-4 py-3 text-sm text-right font-semibold text-blue-600">
          +{averages.aiDeltaRAF.toFixed(3)}
        </td>
        <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">
          -{averages.droppedHCC.toFixed(3)}
        </td>
        <td className="px-4 py-3 text-sm text-right font-semibold text-yellow-600">
          +{averages.missingPOC.toFixed(3)}
        </td>
        <td className="px-4 py-3 text-sm text-right font-semibold text-purple-600">
          +{averages.totalPotential.toFixed(3)}
        </td>
      </tr>
    </tfoot>
  );
}