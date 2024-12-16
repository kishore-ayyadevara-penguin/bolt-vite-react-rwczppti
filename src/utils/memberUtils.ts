import { MemberRAFImprovement } from '../types';

export function generateMemberId(seed: string): string {
  // Use member name as seed for consistent IDs
  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  return Math.abs(hash).toString(36).substring(0, 6).toUpperCase();
}

export function calculateMemberAverages(improvements: MemberRAFImprovement[]) {
  const memberCount = improvements.length;
  if (memberCount === 0) return null;

  return {
    currentRAF: improvements.reduce((sum, imp) => sum + imp.currentHCCValue, 0) / memberCount,
    aiDeltaRAF: improvements.reduce((sum, imp) => sum + imp.aiIdentifiedRAF, 0) / memberCount,
    droppedHCC: improvements.reduce((sum, imp) => sum + imp.droppedHCCValue, 0) / memberCount,
    missingPOC: improvements.reduce((sum, imp) => sum + imp.missedICDImprovement, 0) / memberCount,
    totalPotential: improvements.reduce((sum, imp) => sum + imp.totalPotentialImprovement, 0) / memberCount
  };
}