import { useState } from "react";
import styles from "./Invitation.module.css";
import { OrnamentLine, OrnamentCorner, OrnamentDivider } from "../components/Ornaments";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function Invitation() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [willAttend, setWillAttend] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (willAttend === null) {
      setErrorText("Өтінеміз, келетініңізді немесе келмейтініңізді көрсетеліңіз.");
      return;
    }
    setErrorText("");
    setState("sending");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          will_attend: willAttend,
          guest_count: willAttend ? guestCount : 1,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Жіберу қатесі");
      }
      setState("success");
    } catch (err) {
      setState("error");
      setErrorText(
        err instanceof Error
          ? err.message
          : "Жіберу сәтсіз аяқталды. Кейінірек қайталап көріңіз.",
      );
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOrnamentTop} aria-hidden>
          <OrnamentLine className={styles.ornamentLine} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <OrnamentCorner className={styles.heroCorner} />
            <div className={styles.heroCopy}>
              <div className={styles.heroEventBlock}>
                <span className={styles.heroEvent}>
                  <span className={styles.heroEventName}>Еңлік</span>
                  <span className={styles.heroEventType}>Қыз ұзату</span>
                </span>
              </div>
              <p className={styles.heroSubtitle}>Құрметті қонақтар!</p>
              <p className={styles.heroInvitation}>
                Сіздерді аяулы қызымыз Еңліктің ұзату тойына арналған салтанатты дастарханымыздың қадірлі қонағы болуға шақырамыз!
              </p>
            </div>
          </div>
          <div className={styles.heroImageWrap}>
            <img
              src="/bride.png"
              alt="Ұлттық салт-дәстүрлі келіншек киімі"
              className={styles.heroImage}
            />
          </div>
        </div>
        <div className={styles.heroOrnamentBottom} aria-hidden>
          <OrnamentLine className={styles.ornamentLine} />
        </div>
      </section>

      <OrnamentDivider />

      <section className={styles.whenWhere}>
        <h2 className={styles.whenWhereTitle}>Мекен жайымыз</h2>
        <div className={styles.whenWhereCard}>
          <OrnamentCorner className={styles.cardCornerTL} />
          <OrnamentCorner flip className={styles.cardCornerTR} />
          <OrnamentCorner flip className={styles.cardCornerBL} />
          <OrnamentCorner className={styles.cardCornerBR} />
          <div className={styles.whenWhereInner}>
            <p className={styles.whenWhereItem}>
              <span className={styles.whenWhereLabel}>Күні</span>
              <span className={styles.whenWhereValue}>2026 жылдың 23 наурызы</span>
            </p>
            <p className={styles.whenWhereItem}>
              <span className={styles.whenWhereLabel}>Уақыты</span>
              <span className={styles.whenWhereValue}>11:00</span>
            </p>
            <p className={styles.whenWhereItem}>
              <span className={styles.whenWhereLabel}>Мекенжайы</span>
              <span className={styles.whenWhereValue}>
                Астана қ., Нажимеденова к-сі, 2<br />
                «Жетіген» мейрамханасы
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Қатысатыныңызды растаңыз
        </h2>
        <p className={styles.sectionIntro}>
          Тойға қонақ болып келетініңізді білу біз үшін өте маңызды. Төмендегі форманы толтырып, жауабыңызды жіберіңіз.
        </p>
        <div className={styles.sectionCard}>
          <OrnamentCorner className={styles.cardCornerTL} />
          <OrnamentCorner flip className={styles.cardCornerTR} />
          <OrnamentCorner flip className={styles.cardCornerBL} />
          <OrnamentCorner className={styles.cardCornerBR} />
        {state === "success" ? (
          <div className={styles.thankYou}>
            <p>Рақмет! Жауабыңыз сақталды. Сізді тойымызда күтеміз!</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Аты-жөніңіз *
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Аты-жөні"
                required
                disabled={state === "sending"}
              />
            </label>
            <label className={styles.label}>
              Email немесе телефон *
              <input
                type="text"
                className={styles.input}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="example@mail.kz немесе +7 777 123-45-67"
                required
                disabled={state === "sending"}
              />
            </label>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Сіз келесіз бе? *</legend>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="attend"
                  checked={willAttend === true}
                  onChange={() => setWillAttend(true)}
                  disabled={state === "sending"}
                />
                <span>Иә, қуана келемін</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="attend"
                  checked={willAttend === false}
                  onChange={() => setWillAttend(false)}
                  disabled={state === "sending"}
                />
                <span>Өкінішке орай, келе алмаймын</span>
              </label>
            </fieldset>
            {willAttend === true && (
              <label className={styles.label}>
                Тойға қанша адам келеді? (сізді қоса)
                <select
                  className={styles.select}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  disabled={state === "sending"}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} адам
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className={styles.label}>
              Тілек немесе пікір (міндетті емес)
              <textarea
                className={styles.textarea}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Бізге тілек немесе сөз жазыңыз..."
                rows={3}
                disabled={state === "sending"}
              />
            </label>
            {errorText && <p className={styles.error}>{errorText}</p>}
            <button
              type="submit"
              className={styles.submit}
              disabled={state === "sending"}
            >
              {state === "sending" ? "Жіберілуде…" : "Жауап жіберу"}
            </button>
          </form>
        )}
        </div>
      </section>

      <OrnamentDivider />
      <footer className={styles.footer}>
        <div className={styles.footerOrnament} aria-hidden>
          <OrnamentLine className={styles.ornamentLineLight} />
        </div>
        <p className={styles.footerLove}>Сүйіспеншілікпен</p>
        <p className={styles.footerOrganizers}>
          Той иелері: <strong>Талант</strong> — <strong>Ақмарал</strong>
        </p>
      </footer>
    </div>
  );
}
