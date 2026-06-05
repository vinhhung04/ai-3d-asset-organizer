import { Lightbulb } from 'lucide-react';

interface SuggestionsPanelProps {
  suggestions: string[];
}

export default function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Organization Suggestions</h3>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-600/30 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-300">
              {idx + 1}
            </div>
            <p className="text-sm text-white/70 leading-relaxed">{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
