interface BadgeProps {
  text: string;
  variant?: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  'Public Area': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Safety Area': 'bg-red-500/20 text-red-300 border-red-500/30',
  'IoT / Sensor Point': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Technical Area': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  '360 Panorama': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'Training / Annotation': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Production Area': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Interactive Hotspot': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  'Private Area': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'Navigation Point': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'Facility / Equipment': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  '3D Object': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  High: 'bg-red-500/20 text-red-300 border-red-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Low: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const defaultColor = 'bg-white/10 text-white/60 border-white/20';

export default function Badge({ text, variant, size = 'sm' }: BadgeProps) {
  const key = variant || text;
  const colors = colorMap[key] || defaultColor;
  const sizeClass = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${colors}`}>
      {text}
    </span>
  );
}
