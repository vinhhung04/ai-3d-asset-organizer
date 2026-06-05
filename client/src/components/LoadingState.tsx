import { Cpu } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-6">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu className="w-6 h-6 text-cyan-400/70" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white/80 mb-1">Analyzing your 3D assets...</h3>
      <p className="text-sm text-white/40 mb-6">
        Classifying, generating slugs, and building metadata
      </p>
      <div className="w-full max-w-xs space-y-2">
        {['Parsing asset list', 'Classifying categories', 'Generating slugs'].map((step, i) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500/50 to-purple-600/50 animate-pulse"
                style={{ width: `${60 + i * 15}%`, animationDelay: `${i * 150}ms` }}
              />
            </div>
            <span className="text-xs text-white/30 w-28 text-left">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
