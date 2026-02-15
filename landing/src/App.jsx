import { useState } from "react";

const releaseUrl = "https://github.com/IbraahimLab/Snake-App/releases/latest";

const loopStages = [
  {
    title: "See",
    copy: "Scan open lanes and food position in under a second.",
  },
  {
    title: "Decide",
    copy: "Commit to a turn sequence before pressure catches up.",
  },
  {
    title: "Execute",
    copy: "Move clean, eat, grow, and protect your next escape route.",
  },
  {
    title: "Adapt",
    copy: "When space collapses, shift strategy and stabilize quickly.",
  },
];

const proofCards = [
  {
    label: "Skill Ceiling",
    value: "High",
    copy: "Simple rules, deep mastery through route planning and composure.",
  },
  {
    label: "Session Length",
    value: "2-6 min",
    copy: "Fast runs make replay frictionless and progress immediate.",
  },
  {
    label: "Payoff Loop",
    value: "Instant",
    copy: "Every mistake teaches. Every restart feels like a comeback.",
  },
];

const ladder = [
  {
    tier: "Bronze Run",
    score: "80+",
    focus: "Stay alive with wide loops and no panic turns.",
  },
  {
    tier: "Silver Run",
    score: "180+",
    focus: "Predict 3 moves ahead and avoid dead-end greed.",
  },
  {
    tier: "Gold Run",
    score: "320+",
    focus: "Hold rhythm under pressure and maximize safe food routes.",
  },
];

const controls = ["Arrow Keys / WASD = Move", "Space / P = Pause", "R = Restart", "Esc = Exit"];

const faqs = [
  {
    q: "Is this game beginner friendly?",
    a: "Yes. You learn controls in seconds, then depth grows naturally with every run.",
  },
  {
    q: "Why does it feel addictive?",
    a: "Because feedback is immediate: fail, reset, improve, beat your last score.",
  },
  {
    q: "What is the win condition?",
    a: "There is no cap. The game becomes your personal score challenge ladder.",
  },
];

function App() {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <div className="site">
      <div className="bg-grid" aria-hidden="true" />
      <div className="aura aura-one" aria-hidden="true" />
      <div className="aura aura-two" aria-hidden="true" />

      <header className="nav-wrap">
        <nav className="nav shell">
          <div className="brand">Snake App</div>
          <div className="nav-links">
            <a href="#loop">Loop</a>
            <a href="#ladder">Ladder</a>
            <a href="#faq">FAQ</a>
          </div>
          <a className="btn btn-sm btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
            Download
          </a>
        </nav>
      </header>

      <main className="shell">
        <section className="hero">
          <div className="hero-copy">
            <p className="chip">Shadcn-Inspired Experience</p>
            <h1>A premium snake game loop that pulls players back.</h1>
            <p className="lead">
              This is not just nostalgia. It is a precision arcade challenge designed to reward focus, rhythm, and
              consistency.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
                Play The Latest Build
              </a>
              <a className="btn btn-ghost" href="#loop">
                See How It Hooks You
              </a>
            </div>
            <div className="hero-tags">
              <span>Fast restarts</span>
              <span>High replay value</span>
              <span>Skill-first gameplay</span>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="board">
              <div className="food" />
              <div className="snake s1" />
              <div className="snake s2" />
              <div className="snake s3" />
              <div className="snake head" />
            </div>
            <div className="panel-stats">
              <div>
                <p>Current Mood</p>
                <h3>Locked In</h3>
              </div>
              <div>
                <p>Next Goal</p>
                <h3>New High Score</h3>
              </div>
            </div>
          </aside>
        </section>

        <section className="section" id="loop">
          <div className="section-head">
            <p>Conversion Funnel</p>
            <h2>From first move to obsession</h2>
          </div>
          <div className="loop-grid">
            {loopStages.map((stage, idx) => (
              <article className="card stage-card" key={stage.title}>
                <span className="step">0{idx + 1}</span>
                <h3>{stage.title}</h3>
                <p>{stage.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <p>Player Psychology</p>
            <h2>Why the gameplay sticks</h2>
          </div>
          <div className="proof-grid">
            {proofCards.map((item) => (
              <article className="card proof-card" key={item.label}>
                <p className="muted">{item.label}</p>
                <h3>{item.value}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="ladder">
          <div className="section-head">
            <p>Progression</p>
            <h2>Climb the score ladder</h2>
          </div>
          <div className="ladder-grid">
            {ladder.map((item) => (
              <article className="card ladder-card" key={item.tier}>
                <p className="muted">{item.tier}</p>
                <h3>{item.score}</h3>
                <p>{item.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="split">
            <article className="card controls-card">
              <h3>Controls</h3>
              <ul>
                {controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="card quote-card">
              <p>
                "The best arcade loop is one more run. Snake App is built exactly for that feeling."
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="section-head">
            <p>Objection Handling</p>
            <h2>Quick answers before you play</h2>
          </div>
          <div className="faq-wrap">
            {faqs.map((item, idx) => (
              <button
                type="button"
                className={`faq-item ${activeFaq === idx ? "active" : ""}`}
                onClick={() => setActiveFaq(idx)}
                key={item.q}
              >
                <div>
                  <h3>{item.q}</h3>
                  {activeFaq === idx ? <p>{item.a}</p> : null}
                </div>
                <span>{activeFaq === idx ? "-" : "+"}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div>
            <p className="muted">Final Step</p>
            <h2>Install. Focus. Break your own record.</h2>
            <p>The next run could be your cleanest game yet.</p>
          </div>
          <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
            Download and Start Now
          </a>
        </section>
      </main>
    </div>
  );
}

export default App;
