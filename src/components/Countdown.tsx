import { useState, useEffect } from "react";
import styles from "./Countdown.module.css";

// 23 марта 2026, 13:00 по Алматы (UTC+5)
const TARGET = new Date("2026-03-23T13:00:00+05:00");

function getLeft(now: Date) {
  const diff = TARGET.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return { days, hours, minutes, seconds, past: false };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Countdown() {
  const [left, setLeft] = useState(() => getLeft(new Date()));

  useEffect(() => {
    const t = setInterval(() => setLeft(getLeft(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  if (left.past) {
    return (
      <section className={styles.countdown} aria-label="Обратный отсчёт">
        <p className={styles.countdownDone}>Той басталды!</p>
      </section>
    );
  }

  return (
    <section className={styles.countdown} aria-label="Обратный отсчёт">
      <p className={styles.countdownTitle}>Тойға дейін</p>
      <div className={styles.countdownGrid}>
        <div className={styles.countdownItem}>
          <span className={styles.countdownValue}>{left.days}</span>
          <span className={styles.countdownLabel}>күн</span>
        </div>
        <div className={styles.countdownItem}>
          <span className={styles.countdownValue}>{pad(left.hours)}</span>
          <span className={styles.countdownLabel}>сағат</span>
        </div>
        <div className={styles.countdownItem}>
          <span className={styles.countdownValue}>{pad(left.minutes)}</span>
          <span className={styles.countdownLabel}>минут</span>
        </div>
        <div className={styles.countdownItem}>
          <span className={styles.countdownValue}>{pad(left.seconds)}</span>
          <span className={styles.countdownLabel}>секунд</span>
        </div>
      </div>
    </section>
  );
}
