import axios from 'axios';
import type { AnalyzeRequest, AnalysisResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function analyzeAssets(request: AnalyzeRequest): Promise<AnalysisResult> {
  const response = await axios.post<{ success: boolean; data: AnalysisResult; message?: string }>(
    `${BASE_URL}/api/analyze-assets`,
    request
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Analysis failed.');
  }

  return response.data.data;
}
