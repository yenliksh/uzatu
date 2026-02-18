import styles from "./Ornaments.module.css";

const gold = "#c9a227";
const goldLight = "#e5c76b";

/** Қошқар мүйіз — баран мүйізі стиліндегі сызық */
export function OrnamentLine({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 12 Q20 4 40 12 Q60 20 80 12 Q100 4 120 12 Q140 20 160 12 Q180 4 200 12"
        stroke={gold}
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M0 12 Q25 8 50 12 Q75 16 100 12 Q125 8 150 12 Q175 16 200 12"
        stroke={goldLight}
        strokeWidth="0.6"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

/** Бұрыштық орнамент — алмаз/гүл мотиві */
export function OrnamentCorner({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  const transform = flip ? "scale(-1,-1)" : undefined;
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform }}
      aria-hidden
    >
      <path
        d="M0 40 L40 0 L80 40 L40 80 Z"
        stroke={gold}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M10 40 L40 10 L70 40 L40 70 Z"
        stroke={goldLight}
        strokeWidth="0.8"
        fill="none"
        opacity="0.8"
      />
      <path
        d="M20 40 L40 20 L60 40 L40 60 Z"
        stroke={gold}
        strokeWidth="0.6"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

/** Толық шекара орнаменті — қайталанатын элемент */
export function OrnamentBorder() {
  return (
    <div className={styles.borderWrap} aria-hidden>
      <div className={styles.borderPattern} />
    </div>
  );
}

/** Айырғыш орнамент (секциялар арасында) */
export function OrnamentDivider() {
  return (
    <div className={styles.dividerWrap} aria-hidden>
      <svg viewBox="0 0 120 32" fill="none" className={styles.dividerSvg}>
        <path
          d="M0 16 L20 8 L40 16 L60 8 L80 16 L100 8 L120 16"
          stroke={gold}
          strokeWidth="1"
          fill="none"
        />
        <circle cx="20" cy="8" r="2" fill={gold} />
        <circle cx="40" cy="16" r="2" fill={gold} />
        <circle cx="60" cy="8" r="2" fill={gold} />
        <circle cx="80" cy="16" r="2" fill={gold} />
        <circle cx="100" cy="8" r="2" fill={gold} />
      </svg>
    </div>
  );
}
