import { MemberRAFImprovement } from '../types';

export function calculateTotalRAF(memberImprovements: MemberRAFImprovement[]) {
  if (memberImprovements.length === 0) {
    return {
      current: 0,
      potential: 0,
      percentageToTarget: 0,
      totalCurrent: 0,
      totalPotential: 0
    };
  }

  // Calculate totals for revenue
  const totalCurrentRAF = memberImprovements.reduce((sum, member) => sum + member.currentHCCValue, 0);
  const totalPotentialRAF = memberImprovements.reduce((sum, member) => sum + member.totalPotentialImprovement, 0);

  // Calculate averages for display
  const avgCurrentRAF = totalCurrentRAF / memberImprovements.length;
  const avgPotentialRAF = totalPotentialRAF / memberImprovements.length;

  return {
    current: avgCurrentRAF, // For display
    potential: avgPotentialRAF, // For display
    percentageToTarget: Math.round((avgCurrentRAF / (avgCurrentRAF + avgPotentialRAF)) * 100),
    totalCurrent: totalCurrentRAF, // For revenue calculation
    totalPotential: totalPotentialRAF // For revenue calculation
  };
}