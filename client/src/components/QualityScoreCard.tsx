import { ShieldCheck } from 'lucide-react';
import type { QualityScore } from '../types';

interface QualityScoreCardProps {
  score: QualityScore;
}

const levelConfig = {
  Excellent: {
    scoreColor: 'text-cyan-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    barColor: 'bg-gradient-to-r from-cyan-500 to-emerald-400',
  },
  Good: {
    scoreColor: 'text-yellow-400',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    barColor: 'bg-gradient-to-r from-yellow-500 to-amber-400',
  },
  'Needs Improvement': {
    scoreColor: 'text-red-400',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30',
    barColor: 'bg-gradient-to-r from-red-500 to-orange-400',
  },
};

export default function QualityScoreCard({ score }: QualityScoreCardProps) {
  const cfg = levelConfig[score.level];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">Asset Quality Score</h3>
      </div>

      <div className="flex items-center gap-5 mb-4">
        <div className="text-center">
          <span className={`text-4xl font-bold ${cfg.scoreColor}`}>{score.score}</span>
          <span className="text-lg text-white/30 font-medium">/100</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.badgeClass}`}>
              {score.level}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
              style={{ width: `${score.score}%` }}
            />
          </div>
          <p className="text-xs text-white/50 mt-2 leading-snug">{score.summary}</p>
        </div>
      </div>

      {score.deductions.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
          <span>✓</span>
          <span>No issues detected — perfect asset quality!</span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="text-xs text-white/30 mb-2">Deductions</div>
          {score.deductions.map((d, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <span className="text-white/60">{d.reason}</span>
              <span className="text-red-400 font-semibold ml-3 flex-shrink-0">−{d.points} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
