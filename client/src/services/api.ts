import axios, { AxiosError } from 'axios';
import type { AnalyzeRequest, AnalysisResult } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function analyzeAssets(request: AnalyzeRequest): Promise<AnalysisResult> {
  try {
    const response = await axios.post<{
      success: boolean;
      data: AnalysisResult;
      message?: string;
    }>(`${BASE_URL}/api/analyze-assets`, request);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Analysis failed.');
    }

    return response.data.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      // Extract server's error message from response body
      const serverMessage = err.response?.data?.message;
      if (serverMessage) throw new Error(serverMessage);

      // Network errors
      if (!err.response) {
        const hint = import.meta.env.VITE_API_BASE_URL
          ? `Cannot reach the server at ${import.meta.env.VITE_API_BASE_URL}. The backend may be sleeping (Render free tier) — wait 30s and retry.`
          : 'Cannot reach the server. Make sure the backend is running on port 3001.';
        throw new Error(hint);
      }
    }
    throw err;
  }
}
