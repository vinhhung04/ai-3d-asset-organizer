import { AlertCircle } from 'lucide-react';
import type { AnalysisResult, AppState } from '../types';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';
import MetadataCard from './MetadataCard';
import AssetsTable from './AssetsTable';
import SuggestionsPanel from './SuggestionsPanel';
import WarningsPanel from './WarningsPanel';
import JsonPreview from './JsonPreview';
import QualityScoreCard from './QualityScoreCard';
import { exportToCsv } from '../utils/exportCsv';

interface OutputDashboardProps {
  appState: AppState;
  result: AnalysisResult | null;
  errorMessage: string;
}

export default function OutputDashboard({ appState, result, errorMessage }: OutputDashboardProps) {
  if (appState === 'idle') {
    return (
      <div className="glass-card h-full min-h-[500px]">
        <EmptyState />
      </div>
    );
  }

  if (appState === 'loading') {
    return (
      <div className="glass-card h-full min-h-[500px]">
        <LoadingState />
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className="glass-card p-5 border-red-500/20 min-h-[200px] flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-400 mb-1">Analysis Failed</h3>
          <p className="text-sm text-white/60 leading-relaxed">{errorMessage}</p>
          <p className="text-xs text-white/30 mt-2">
            Check your input and try again, or reload the demo data.
          </p>
        </div>
      </div>
    );
  }

  if (appState === 'success' && result) {
    return (
      <div className="space-y-4">
        <MetadataCard metadata={result.project_metadata} />
        {result.quality_score && <QualityScoreCard score={result.quality_score} />}
        <AssetsTable
          assets={result.classified_assets}
          onExport={() => exportToCsv(result)}
        />
        <SuggestionsPanel suggestions={result.organization_suggestions} />
        <WarningsPanel warnings={result.data_quality_warnings} />
        <JsonPreview data={result} />
      </div>
    );
  }

  return null;
}
