import { HCCDescriptions, HCCRAFValues } from '../constants/hccData';

export function getHCCDescription(hccCode: string): string {
  return HCCDescriptions[hccCode] || hccCode;
}

export function calculateRAFValue(hccCode: string): number {
  return HCCRAFValues[hccCode] || 0.3;
}