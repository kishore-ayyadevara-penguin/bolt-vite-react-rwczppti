import { AnalysisResults, APIPatientResponse, MemberRAFImprovement } from '../types';
import { uploadAndAnalyzeFiles } from '../services/api';
import { createDocumentCategories } from './transformUtils';
import { calculateTotalRAF } from './rafCalculations';

function transformAPIResponseToAnalysisResults(apiResponse: APIPatientResponse[]): AnalysisResults {
  const memberImprovements: MemberRAFImprovement[] = apiResponse.map(patient => {
    const document = {
      id: `doc_${patient.basic_data.member}`,
      title: `Clinical Notes - ${patient.basic_data.facility}`,
      url: patient.download_url,
      date: new Date().toISOString().split('T')[0],
      provider: patient.basic_data.provider,
      facility: patient.basic_data.facility,
      categories: createDocumentCategories(patient.metadata),
      page_wise_ocr: patient.page_wise_ocr
    };

    const rafScores = patient.raf_scores;
    return {
      memberId: patient.basic_data.member,
      name: patient.basic_data.member,
      facility: patient.basic_data.facility,
      provider: patient.basic_data.provider,
      currentHCCValue: parseFloat(rafScores.current_raf),
      aiIdentifiedRAF: parseFloat(rafScores.ai_delta_raf),
      droppedHCCValue: parseFloat(rafScores.droppped_hcc_raf),
      missedICDImprovement: parseFloat(rafScores.missing_poc),
      totalPotentialImprovement: parseFloat(rafScores.total_potential),
      documents: [document]
    };
  });

  return {
    rafScores: calculateTotalRAF(memberImprovements),
    missingHCCCodes: [],
    currentHCCCodes: [],
    missedICDCodes: [],
    patientsNeedingVisit: [],
    memberImprovements
  };
}

function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min) * 1000;
}

export async function analyzeClinicalNotes(files: FileList): Promise<AnalysisResults> {
  try {
    const delay = getRandomDelay(2, 4);
    const apiResponse = await uploadAndAnalyzeFiles();
    await new Promise(resolve => setTimeout(resolve, delay));
    return transformAPIResponseToAnalysisResults(apiResponse);
  } catch (error) {
    console.error('Error analyzing clinical notes:', error);
    throw error;
  }
}