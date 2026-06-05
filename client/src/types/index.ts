export interface ClassifiedAsset {
  original_name: string;
  category: string;
  asset_type: string;
  suggested_slug: string;
  priority: 'High' | 'Medium' | 'Low';
  management_note: string;
}

export interface DataQualityWarning {
  asset: string;
  issue: string;
  suggestion: string;
}

export interface ProjectMetadata {
  project_name: string;
  project_type: string;
  total_assets: number;
  main_categories: string[];
  summary: string;
  recommended_naming_convention: string;
}

export interface AnalysisResult {
  project_metadata: ProjectMetadata;
  classified_assets: ClassifiedAsset[];
  organization_suggestions: string[];
  data_quality_warnings: DataQualityWarning[];
}

export interface AnalyzeRequest {
  projectName: string;
  projectType: string;
  inputMode: 'text' | 'json';
  rawInput: string;
}

export type AppState = 'idle' | 'loading' | 'success' | 'error';

export type ProjectType =
  | 'Apartment'
  | 'Office'
  | 'Retail Showroom'
  | 'Factory'
  | 'Museum'
  | 'Exhibition'
  | 'School'
  | 'Tourism Site';

export type InputMode = 'text' | 'json';
