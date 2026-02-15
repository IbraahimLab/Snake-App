const releaseUrl = "https://github.com/IbraahimLab/Snake-App/releases/latest";
const funnelSteps = [
  {
    stage: "Step 1",
    title: "Spawn and read the board",
    text: "You start in the center as a short snake. Walls are solid, so your first goal is to map open lanes.",
  },
  {
    stage: "Step 2",
    title: "Commit to direction control",
    text: "Use Arrow keys or WASD. You cannot reverse into yourself, so every turn is a forward commitment.",
  },
  {
    stage: "Step 3",
    title: "Eat food and increase score",
    text: "Each food pickup adds one segment and gives +10 points. Growth raises difficulty because space shrinks.",
  },
  {
    stage: "Step 4",
    title: "Shift into loop management",
    text: "When the snake gets longer, route in wide loops and keep escape paths open before taking risky food angles.",
  },
  {
    stage: "Step 5",
    title: "Survive, fail, restart, improve",
    text: "Touching a wall or your body ends the run. Press R instantly to restart and push for a higher best score.",
  },
];

const controls = [
  "Move: Arrow keys or WASD",
  "Pause: Space or P",
  "Restart: R",
  "Exit: Esc",
];

function App() {
  return (
    <div className="page-shell">
      <div className="orb orb-a" aria-hidden="true" />
      <div className="orb orb-b" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <header className="hero container reveal">
        <p className="eyebrow">Snake Game Funnel</p>
        <h1>How Snake Works</h1>
        <p className="subtitle">
          A simple loop with rising pressure: navigate, eat, grow, and survive tighter space each second.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
            Download for Windows
          </a>
          <a className="btn btn-secondary" href="#funnel">
            See The Flow
          </a>
        </div>
        <p className="micro-note">Learn the loop, then play it.</p>
      </header>

      <main className="container">
        <section id="funnel" className="panel reveal stagger-1">
          <h2>Round Funnel</h2>
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
              </ul>
            </article>
          </div>
        </section>

        <section className="panel reveal stagger-3">
          <article className="cta-band">
            <div>
              <h2>Ready for your first run?</h2>
              <p>Start with safe loops, then push for longer routes and cleaner turns.</p>
            </div>
            <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
              Download and Play
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
