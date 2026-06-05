import { useState } from 'react';
import { Boxes, Zap, Github } from 'lucide-react';
import InputPanel from './components/InputPanel';
import OutputDashboard from './components/OutputDashboard';
import { analyzeAssets } from './services/api';
import type { AnalysisResult, AppState, InputMode } from './types';

export default function App() {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [rawInput, setRawInput] = useState('');

  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoadDemo = (preset: { projectName: string; projectType: string; rawInput: string }) => {
    setProjectName(preset.projectName);
    setProjectType(preset.projectType);
    setInputMode('text');
    setRawInput(preset.rawInput);
    setAppState('idle');
    setResult(null);
    setErrorMessage('');
  };

  const handleAnalyze = async () => {
    setAppState('loading');
    setResult(null);
    setErrorMessage('');
    try {
      const data = await analyzeAssets({ projectName, projectType, inputMode, rawInput });
      setResult(data);
      setAppState('success');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setErrorMessage(message);
      setAppState('error');
    }
  };

  const handleReset = () => {
    setProjectName('');
    setProjectType('');
    setInputMode('text');
    setRawInput('');
    setAppState('idle');
    setResult(null);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Subtle background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Boxes className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-3 py-1">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Built for 3D/360 Digital Twin Workflow
                  </span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                <span className="gradient-text">AI 3D/360</span>{' '}
                <span className="text-white">Asset Organizer</span>
              </h1>
              <p className="text-sm text-white/50 max-w-xl leading-relaxed">
                Organize 3D/360 project assets into structured categories, clean slugs, metadata,
                and management suggestions — powered by AI.
              </p>
            </div>
            <a
              href="https://github.com/vinhhung04/ai-3d-asset-organizer"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mt-1"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
          </div>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="lg:sticky lg:top-6">
            <InputPanel
              projectName={projectName}
              projectType={projectType}
              inputMode={inputMode}
              rawInput={rawInput}
              isLoading={appState === 'loading'}
              onProjectNameChange={setProjectName}
              onProjectTypeChange={setProjectType}
              onInputModeChange={setInputMode}
              onRawInputChange={setRawInput}
              onLoadDemo={handleLoadDemo}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
            />
          </div>

          <div>
            <OutputDashboard appState={appState} result={result} errorMessage={errorMessage} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-white/20">
          AI 3D/360 Asset Organizer · Built for StarGlobal 3D Internship Test · 2025
        </footer>
      </div>
    </div>
  );
}
