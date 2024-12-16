import { CodeEvidence, DocumentCategory } from '../types';
import { getHCCDescription, calculateRAFValue } from './hccUtils';

export function transformMetadataToEvidence(
  metadata: Record<string, Record<string, Array<{ text: string; start_idx: number; end_idx: number }>>>
): CodeEvidence[] {
  return Object.entries(metadata).map(([hccCode, pageData]) => {
    const supportingText = Object.entries(pageData)
      .flatMap(([pageNum, sentences]) => 
        sentences.map(sentence => ({
          text: sentence.text,
          pageNumber: parseInt(pageNum),
          start_idx: sentence.start_idx,
          end_idx: sentence.end_idx
        }))
      )
      .filter(item => item.text);

    return {
      code: hccCode,
      description: getHCCDescription(hccCode),
      rafValue: calculateRAFValue(hccCode),
      supportingText,
      pageNumbers: Array.from(new Set(supportingText.map(item => item.pageNumber)))
    };
  });
}

export function createDocumentCategories(
  metadata: Record<string, Record<string, Array<{ text: string; start_idx: number; end_idx: number }>>>
): DocumentCategory[] {
  if (!metadata || Object.keys(metadata).length === 0) {
    return [];
  }

  const evidence = transformMetadataToEvidence(metadata);
  return [{
    type: 'current-hcc',
    codes: evidence
  }];
}