export type DoxaAvatarMood = "lost" | "broken" | "calm";

/**
 * The brand's one illustrated character: a watch case drawn as a face.
 * Stroke-only, on-brand geometry (case + lugs + crown, same vocabulary as
 * the product photography) - never an emoji or stock icon. `calm` poses
 * the hands at 10:10, the classic "smiling watch" position watch brands
 * shoot for in real product photography.
 */
export function DoxaAvatar({
  mood,
  className = "",
}: {
  mood: DoxaAvatarMood;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      {/* lugs */}
      <path d="M50 16h20M50 104h20" strokeWidth="3" />
      {/* crown */}
      <rect x="102" y="52" width="10" height="16" rx="2" strokeWidth="2.5" />
      {/* case */}
      <circle cx="60" cy="60" r="44" strokeWidth="3" />
      <circle cx="60" cy="60" r="38" strokeWidth="1.5" opacity="0.35" />

      {mood === "calm" && (
        <>
          <circle cx="46" cy="54" r="3" fill="currentColor" stroke="none" />
          <circle cx="74" cy="54" r="3" fill="currentColor" stroke="none" />
          {/* hands at 10:10 */}
          <path d="M60 60 44 40M60 60 78 40" strokeWidth="3" />
        </>
      )}

      {mood === "lost" && (
        <>
          <circle cx="45" cy="53" r="3" fill="currentColor" stroke="none" />
          <circle cx="76" cy="56" r="3" fill="currentColor" stroke="none" />
          {/* scattered hands - hour drooping, minute off at an odd angle */}
          <path d="M60 60 42 78" strokeWidth="3.5" />
          <path d="M60 60 88 44" strokeWidth="2.5" />
          {/* motion dashes suggesting the case spun off course */}
          <path d="M14 40q-6 6 0 12M106 68q6 6 0 12" strokeWidth="2" opacity="0.5" />
        </>
      )}

      {mood === "broken" && (
        <>
          <path d="M42 51h8M70 51h8" strokeWidth="3" />
          {/* crack across the face */}
          <path d="M27 45 45 60 38 66 60 84 74 70 96 82" strokeWidth="2" opacity="0.6" />
          {/* hands drooping to 6:30 */}
          <path d="M60 60 52 92M60 60 68 90" strokeWidth="3" />
        </>
      )}
    </svg>
  );
}
