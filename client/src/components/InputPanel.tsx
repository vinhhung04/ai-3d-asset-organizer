import { useState, useRef, useEffect } from 'react';
import { Loader2, Sparkles, RotateCcw, FlaskConical, ChevronDown } from 'lucide-react';
import type { InputMode, ProjectType } from '../types';

const PROJECT_TYPES: ProjectType[] = [
  'Apartment',
  'Office',
  'Retail Showroom',
  'Factory',
  'Museum',
  'Exhibition',
  'School',
  'Tourism Site',
];

export const DEMO_PRESETS = [
  {
    label: 'Smart Factory',
    projectName: 'Smart Factory 3D/360 Demo',
    projectType: 'Factory' as ProjectType,
    rawInput: `Main entrance 360 panorama
Reception desk
Production line overview
Machine control panel
Electrical cabinet
Server room
Safety instruction hotspot
Emergency exit door
Fire extinguisher
IoT temperature sensor
Employee training hotspot
Warehouse storage area
Quality inspection station
Control room
Visitor route marker`,
  },
  {
    label: 'Retail Showroom',
    projectName: 'Modern Retail Showroom 360',
    projectType: 'Retail Showroom' as ProjectType,
    rawInput: `Entrance panorama
Product display showcase A
Product display showcase B
Fitting room 360 view
POS counter
Window display zone
Stockroom
CCTV hotspot
Lighting sensor
Customer route marker
Gift wrapping counter
Staff area`,
  },
  {
    label: 'Apartment',
    projectName: 'Luxury Apartment Virtual Tour',
    projectType: 'Apartment' as ProjectType,
    rawInput: `Living room 360 panorama
Master bedroom view
Kitchen overview
Bathroom
Balcony panorama
Front door entrance
Security sensor
Smart thermostat
Dining area
Home office desk
Laundry room
Storage closet`,
  },
  {
    label: 'Museum Exhibition',
    projectName: 'Heritage Museum Digital Twin',
    projectType: 'Museum' as ProjectType,
    rawInput: `Main hall panorama
Artifact showcase A
Artifact showcase B
Info hotspot gallery entrance
Emergency exit marker
HVAC sensor control
Guided tour route marker
Storage room
Ticket counter
Gift shop display
Staff training annotation
Outdoor garden panorama`,
  },
  {
    label: 'Office',
    projectName: 'Corporate Office 3D Tour',
    projectType: 'Office' as ProjectType,
    rawInput: `Reception panorama
Open plan floor overview
Meeting room A
Meeting room B
Server room
Fire extinguisher station
CEO office
Training room
Visitor badge hotspot
Electrical panel
Cafeteria area
Emergency exit corridor`,
  },
];

interface InputPanelProps {
  projectName: string;
  projectType: string;
  inputMode: InputMode;
  rawInput: string;
  isLoading: boolean;
  onProjectNameChange: (v: string) => void;
  onProjectTypeChange: (v: string) => void;
  onInputModeChange: (v: InputMode) => void;
  onRawInputChange: (v: string) => void;
  onLoadDemo: (preset: { projectName: string; projectType: string; rawInput: string }) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function InputPanel({
  projectName,
  projectType,
  inputMode,
  rawInput,
  isLoading,
  onProjectNameChange,
  onProjectTypeChange,
  onInputModeChange,
  onRawInputChange,
  onLoadDemo,
  onAnalyze,
  onReset,
}: InputPanelProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lineCount = rawInput.split('\n').filter(l => l.trim()).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Project Input</h2>
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            disabled={isLoading}
            className="btn-outline text-xs gap-1.5 py-1.5 min-w-[120px] justify-between"
          >
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              {selectedLabel || 'Load Demo...'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-[#0d1220] border border-white/10 rounded-lg shadow-xl w-44 py-1 overflow-hidden">
              {DEMO_PRESETS.map(p => (
                <div
                  key={p.label}
                  className={`px-3 py-2 text-xs cursor-pointer transition-colors ${
                    selectedLabel === p.label
                      ? 'text-cyan-400 bg-cyan-500/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onMouseEnter={() => onLoadDemo(p)}
                  onClick={() => {
                    setSelectedLabel(p.label);
                    setDropdownOpen(false);
                  }}
                >
                  {p.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Project Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={projectName}
            onChange={e => onProjectNameChange(e.target.value)}
            placeholder="e.g. Smart Factory 3D/360 Demo"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Project Type <span className="text-red-400">*</span>
          </label>
          <select
            value={projectType}
            onChange={e => onProjectTypeChange(e.target.value)}
            className="input-field appearance-none cursor-pointer"
            disabled={isLoading}
          >
            <option value="" className="bg-[#0a0e1a]">Select project type...</option>
            {PROJECT_TYPES.map(t => (
              <option key={t} value={t} className="bg-[#0a0e1a]">
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Input Mode</label>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['text', 'json'] as InputMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => onInputModeChange(mode)}
                disabled={isLoading}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  inputMode === mode
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {mode === 'text' ? 'Raw Text' : 'Simple JSON'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">
            Asset List <span className="text-red-400">*</span>
          </label>
          <textarea
            value={rawInput}
            onChange={e => onRawInputChange(e.target.value)}
            placeholder={
              inputMode === 'text'
                ? 'One asset per line:\nMain entrance 360 panorama\nReception desk\n...'
                : '["Main entrance 360 panorama", "Reception desk", ...]'
            }
            rows={12}
            className="input-field font-mono text-xs resize-none leading-relaxed"
            disabled={isLoading}
          />
          <div className="text-xs text-white/25 mt-1 text-right">
            {lineCount > 0 ? `${lineCount} asset${lineCount !== 1 ? 's' : ''} detected` : 'No assets yet'}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Assets
            </>
          )}
        </button>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="btn-ghost-red sm:w-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
