const releaseUrl = "https://github.com/IbraahimLab/Snake-App/releases/latest";
const repoUrl = "https://github.com/IbraahimLab/Snake-App";

const features = [
  {
    title: "Desktop-native gameplay",
    detail: "Built in Python + Tkinter, runs smoothly without browser overhead.",
  },
  {
    title: "Simple install flow",
    detail: "Download installer or portable zip directly from GitHub Releases.",
  },
  {
    title: "Release-aware app",
    detail: "The game checks for new versions and links users to the latest build.",
  },
];

const installSteps = [
  "Download the latest Windows release.",
  "Run SnakeApp-Setup-windows-x64.exe.",
  "Click through install, launch, and play.",
];

const releaseTrack = [
  "Tag-based CI builds artifacts on every v* release.",
  "Portable and installer binaries are uploaded automatically.",
  "SHA256 checksums ship with each release.",
];

function App() {
  return (
    <div className="page-shell">
      <div className="noise" aria-hidden="true" />
      <header className="hero container reveal">
        <p className="eyebrow">Windows Desktop Game</p>
        <h1>Snake App</h1>
        <p className="subtitle">
          Classic snake, modern shipping pipeline, and one-click download for players.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
            Download for Windows
          </a>
          <a className="btn btn-secondary" href={repoUrl} target="_blank" rel="noreferrer">
            View Source
          </a>
        </div>
        <p className="micro-note">Current channel: GitHub Releases</p>
      </header>

      <main className="container">
        <section className="panel reveal stagger-1">
          <h2>Why people can trust this build</h2>
          <div className="grid cards">
            {features.map((item) => (
              <article className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel reveal stagger-2">
          <div className="two-col">
            <article className="card soft">
              <h2>Install in under 2 minutes</h2>
              <ol>
                {installSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
            <article className="card soft">
              <h2>Release process</h2>
              <ul>
                {releaseTrack.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="panel reveal stagger-3">
          <article className="cta-band">
            <div>
              <h2>Play the first release</h2>
              <p>Installer and portable binaries are both available in the latest release page.</p>
            </div>
            <a className="btn btn-primary" href={releaseUrl} target="_blank" rel="noreferrer">
              Open Latest Release
            </a>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
