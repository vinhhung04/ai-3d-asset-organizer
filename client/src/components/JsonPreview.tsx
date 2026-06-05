import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Code } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface JsonPreviewProps {
  data: AnalysisResult;
}

export default function JsonPreview({ data }: JsonPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for non-secure context
      const el = document.createElement('textarea');
      el.value = json;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Raw JSON Output</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30">{open ? 'Hide' : 'Show'}</span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-white/30" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/30" />
          )}
        </div>
      </button>

      {open && (
        <>
          <div className="border-t border-white/10 px-5 py-3 flex justify-end">
            <button onClick={handleCopy} className="btn-outline text-xs gap-1.5">
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy JSON
                </>
              )}
            </button>
          </div>
          <div className="border-t border-white/5 bg-black/30 px-5 py-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="text-xs text-green-300/80 font-mono leading-relaxed whitespace-pre">
              {json}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
