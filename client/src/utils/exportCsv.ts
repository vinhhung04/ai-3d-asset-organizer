import type { AnalysisResult } from '../types';

export function exportToCsv(result: AnalysisResult): void {
  const headers = [
    'original_name',
    'category',
    'asset_type',
    'suggested_slug',
    'priority',
    'confidence',
    'classification_reason',
    'management_note',
  ];

  const rows = result.classified_assets.map(a => [
    a.original_name,
    a.category,
    a.asset_type,
    a.suggested_slug,
    a.priority,
    a.confidence !== undefined ? `${Math.round(a.confidence * 100)}%` : '',
    a.classification_reason ?? '',
    a.management_note,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const filename = `${result.project_metadata.project_name
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()}-asset-analysis.csv`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
