const releaseUrl = "https://github.com/IbraahimLab/Snake-App/releases/latest";
const topPoints = [
  "Instant start, no account wall",
  "Simple controls, deep mastery",
  "Short runs that turn into long sessions",
];

const emotions = [
  {
    title: "You feel in control",
    text: "Every turn is your decision. No randomness in movement. Your skill defines the run.",
  },
  {
    title: "You feel pressure fast",
    text: "The board gets tighter every minute. One clean route becomes your lifeline.",
  },
  {
    title: "You feel the comeback",
    text: "Every game over is immediate feedback. Restart, adapt, and beat your best score.",
  },
];

const funnelSteps = [
  {
    stage: "Step 1",
    title: "Start clean",
    text: "You spawn in open space with a short snake and full options.",
  },
  {
    stage: "Step 2",
    title: "Pick your first lane",
    text: "Arrow keys or WASD set direction. You cannot reverse into yourself.",
  },
  {
    stage: "Step 3",
    title: "Collect food",
    text: "Each pickup gives +10 points and one extra body segment.",
  },
  {
    stage: "Step 4",
    title: "Lose space, gain pressure",
    text: "The longer you grow, the smaller your safe routes become.",
  },
  {
    stage: "Step 5",
    title: "Enter focus mode",
    text: "You stop reacting and start planning 3 to 5 moves ahead.",
  },
  {
    stage: "Step 6",
    title: "Game over teaches instantly",
    text: "Hit a wall or yourself and the run ends. You instantly see what to fix.",
  },
  {
    stage: "Step 7",
    title: "Restart and climb",
    text: "Press R, run again, and chase a higher personal best.",
  },
];

const controls = [
  "Move: Arrow keys or WASD",
  "Pause: Space or P",
  "Restart: R",
  "Exit: Esc",
];

const levels = [
  { tier: "Beginner Goal", target: "Score 80", plan: "Stay wide, avoid tight corners, survive." },
  { tier: "Intermediate Goal", target: "Score 200", plan: "Build loops and keep one escape route alive." },
  { tier: "Advanced Goal", target: "Score 350+", plan: "Control panic, trap-proof turns, and optimize food pathing." },
];

const faqs = [
  {
    q: "How long is one run?",
    a: "Most runs are 2 to 6 minutes, which makes replay feel frictionless.",
  },
  {
    q: "Is this only for hardcore players?",
    a: "No. Controls are simple in 10 seconds, then depth grows naturally.",
  },
  {
    q: "Why is it hard to stop playing?",
    a: "Short feedback loops plus clear score goals create a strong just-one-more-run effect.",
  },
];

function App() {
  return (
    <div className="page-shell">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <header className="hero container reveal">
        <p className="eyebrow">Classic Arcade Reborn</p>
        <h1>One Run Turns Into Ten</h1>
        <p className="subtitle">
          Snake is the purest skill loop: easy to start, hard to master, impossible to ignore when your score is
          one run away.
        </p>
        <div className="pill-row">
          {topPoints.map((point) => (
            <span key={point} className="pill">
              {point}
            </span>
          ))}
        </div>
        <div className="cta-row">
          <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
            Download for Windows
          </a>
          <a className="btn btn-secondary" href="#funnel">
            Explore Game Funnel
          </a>
        </div>
        <p className="micro-note">No setup friction. Install, press play, chase your best.</p>
      </header>

      <main className="container">
        <section className="panel reveal stagger-1">
          <h2>Why Players Keep Coming Back</h2>
          <div className="three-col">
            {emotions.map((item) => (
              <article className="card spotlight" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="funnel" className="panel reveal stagger-1">
          <h2>Gameplay Funnel</h2>
          <div className="funnel-track">
            {funnelSteps.map((step) => (
              <article className="funnel-step" key={step.stage}>
                <p className="step-label">{step.stage}</p>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel reveal stagger-2">
          <div className="two-col">
            <article className="card">
              <h2>Controls</h2>
              <ul className="clean-list">
                {controls.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <h2>Scoring Logic</h2>
              <ul className="clean-list">
                <li>Every food gives +10 points.</li>
                <li>Best score is saved between runs.</li>
                <li>Longer snake means less room and higher risk.</li>
                <li>Progress feels visible every minute.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="panel reveal stagger-3">
          <h2>Challenge Path</h2>
          <div className="three-col">
            {levels.map((item) => (
              <article className="card tier" key={item.tier}>
                <p className="tier-label">{item.tier}</p>
                <h3>{item.target}</h3>
                <p>{item.plan}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel reveal stagger-3">
          <h2>Quick Answers</h2>
          <div className="faq-stack">
            {faqs.map((item) => (
              <article className="card faq" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel reveal stagger-3">
          <article className="cta-band">
            <div>
              <h2>Your Next Personal Best Is Waiting</h2>
              <p>Install now, run one game, and feel how fast the score chase hooks you.</p>
            </div>
            <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
              Start Playing Now
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
