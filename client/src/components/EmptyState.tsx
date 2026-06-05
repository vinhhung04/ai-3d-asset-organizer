import { Boxes, ArrowLeft } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-5">
        <Boxes className="w-10 h-10 text-cyan-400/70" />
      </div>
      <h3 className="text-xl font-semibold text-white/80 mb-2">Ready to Organize</h3>
      <p className="text-sm text-white/40 max-w-xs mb-4">
        Fill in your project details and asset list on the left, then click{' '}
        <span className="text-cyan-400">Analyze Assets</span> to get AI-powered classification.
      </p>
      <div className="flex items-center gap-2 text-xs text-white/30">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Start by loading the demo project</span>
      </div>
    </div>
  );
}
