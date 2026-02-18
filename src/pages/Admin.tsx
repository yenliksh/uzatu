import { useState, useEffect } from "react";
import styles from "./Admin.module.css";

interface RsvpEntry {
  id: number;
  name: string;
  contact: string;
  will_attend: number;
  guest_count: number;
  message: string | null;
  created_at: string;
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [list, setList] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("wedding_admin_token");
    if (saved) setToken(saved);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp?password=" + encodeURIComponent(password));
      if (!res.ok) {
        if (res.status === 401) throw new Error("Құпия сөз қате");
        throw new Error("Жүктеу қатесі");
      }
      const data = await res.json();
      setList(data);
      setToken(password);
      sessionStorage.setItem("wedding_admin_token", password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Қате");
    } finally {
      setLoading(false);
    }
  }

  async function loadList() {
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/rsvp", {
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setToken("");
          sessionStorage.removeItem("wedding_admin_token");
          setError("Сессия аяқталды. Құпия сөзді қайта енгізіңіз.");
          return;
        }
        throw new Error("Жүктеу қатесі");
      }
      const data = await res.json();
      setList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Қате");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) loadList();
  }, [token]);

  function logout() {
    setToken("");
    setList([]);
    setPassword("");
    sessionStorage.removeItem("wedding_admin_token");
  }

  const attending = list.filter((r) => r.will_attend === 1);
  const totalGuests = attending.reduce((s, r) => s + r.guest_count, 0);

  if (!token) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.title}>Ұйымдастырушыларға кіру</h1>
          <form onSubmit={login} className={styles.form}>
            <label className={styles.label}>
              Құпия сөз
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Құпия сөзді енгізіңіз"
                autoFocus
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Кіру…" : "Кіру"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Шақыру бойынша жауаптар</h1>
          <div className={styles.actions}>
            <button type="button" onClick={loadList} className={styles.smallButton} disabled={loading}>
              Жаңарту
            </button>
            <button type="button" onClick={logout} className={styles.smallButton}>
              Шығу
            </button>
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.stats}>
          <p>Жауаптар саны: <strong>{list.length}</strong></p>
          <p>Келетіндер: <strong>{attending.length}</strong> (барлық қонақтар: <strong>{totalGuests}</strong>)</p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Аты-жөні</th>
                <th>Байланыс</th>
                <th>Келеді</th>
                <th>Қонақ</th>
                <th>Пікір</th>
                <th>Күні</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.contact}</td>
                  <td>{row.will_attend ? "Иә" : "Жоқ"}</td>
                  <td>{row.guest_count}</td>
                  <td>{row.message ?? "—"}</td>
                  <td>{new Date(row.created_at).toLocaleString("kk-KZ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {list.length === 0 && !loading && <p className={styles.empty}>Әзірше жауап жоқ.</p>}
      </div>
    </div>
  );
}
