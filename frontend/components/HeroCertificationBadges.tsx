const CERTIFICATIONS = [
  { badge: "SFDA", label: "هيئة الغذاء والدواء", sub: "SFDA" },
  { badge: "🔬", label: "GMP", sub: "Certified" },
  { badge: "✦", label: "مكمّل غذائي", sub: "Supplement" },
] as const;

export default function HeroCertificationBadges() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-5">
      {CERTIFICATIONS.map((cert) => (
        <div
          key={cert.label}
          className="flex flex-col items-center text-center gap-1.5 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/90 px-2 py-3 shadow-sm hover:shadow-md hover:border-sage/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-sage/8 border border-sage/12 flex items-center justify-center">
            <span className="text-[10px] font-extrabold text-sage leading-none">{cert.badge}</span>
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-gray-800 leading-tight">{cert.label}</p>
            <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{cert.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
