# Snake App

Arcade focus. Zero fluff.  
`Snake App` is a desktop Snake game built with Python + Tkinter, shipped as a Windows executable, with a premium React landing page ready for Vercel.

## Live Links

- Latest release: `https://github.com/IbraahimLab/Snake-App/releases/latest`
- Repository: `https://github.com/IbraahimLab/Snake-App`

## What You Get

- Fast desktop gameplay loop
- Persistent best score across sessions
- In-app update check against GitHub Releases
- Windows packaging pipeline (`.exe`, portable zip, installer)
- Tag-based GitHub Actions release automation
- Modern landing page in `landing/` (React + Vite + Vercel)

## Gameplay

Goal: survive as long as possible and push your score higher each run.

- Eat food to grow and gain points
- Avoid walls and your own body
- Recover fast after game over and restart instantly

### Controls

- `Arrow Keys` or `WASD`: Move
- `Space` or `P`: Pause
- `R`: Restart run
- `Esc`: Exit game

## Tech Stack

### Desktop Game

- Python `3.13`
- Tkinter UI
- Local config/log persistence in `%LOCALAPPDATA%/SnakeApp`

### Distribution

- PyInstaller (standalone exe)
- Inno Setup (Windows installer)
- GitHub Actions (CI release pipeline)

### Landing

- React + Vite
- Static deploy on Vercel

## Project Structure

```text
Snake-App/
  app/
    main.py
    version.py
    game/
  installer/
    SnakeApp.iss
  scripts/
    build_windows.bat
  landing/
    src/
    index.html
    package.json
    vercel.json
  .github/workflows/
    release.yml
  requirements-dev.txt
  README.md
```

## Quick Start (Local Dev)

### 1. Run the desktop game

```bash
python app/main.py
```

### 2. Run landing page locally

```bash
cd landing
npm install
npm run dev
```

## Build Windows Artifacts Locally

Install build dependency:

```bash
python -m pip install -r requirements-dev.txt
```

Build executable + portable zip:

```bash
scripts\build_windows.bat
```

Outputs:

- `dist/SnakeApp.exe`
- `release/SnakeApp-portable-windows-x64.zip`

Build installer (if Inno Setup installed):

```bash
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\SnakeApp.iss
```

Output:

- `release/SnakeApp-Setup.exe`

## Release Flow (GitHub)

The workflow in `.github/workflows/release.yml` publishes on tag push.

### Release steps

1. Commit + push `main`
2. Create version tag:
   - `git tag -a v1.0.0 -m "v1.0.0"`
   - `git push origin v1.0.0`
3. GitHub Actions builds and uploads:
   - `SnakeApp-Setup-windows-x64.exe`
   - `SnakeApp-portable-windows-x64.zip`
   - `SHA256SUMS.txt`

## Code Signing (Recommended)

Unsigned apps can trigger SmartScreen warnings.  
To sign in CI, set repository secrets:

- `WINDOWS_CERT_BASE64` (base64 of `.pfx`)
- `WINDOWS_CERT_PASSWORD`

If not set, release still publishes unsigned binaries.

## Landing Deployment (Vercel)

1. Import this repo in Vercel
2. Set **Root Directory** to `landing`
3. Deploy

Useful commands:

```bash
cd landing
npm run build
npm run preview
```

## Logging and Persistence

Desktop app stores data in:

- Logs: `%LOCALAPPDATA%\SnakeApp\logs\snake.log`
- Config/high score: `%LOCALAPPDATA%\SnakeApp\config.json`

## Troubleshooting

- `pyinstaller` not found:
  - run `python -m pip install -r requirements-dev.txt`
- Installer build fails:
  - verify Inno Setup is installed at `C:\Program Files (x86)\Inno Setup 6\`
- Landing build fails:
  - run `cd landing && npm install` then `npm run build`

## Roadmap Ideas

- Sound effects + background music toggle
- Difficulty modes (speed tiers)
- Leaderboard sync
- Signed production builds
- Auto-update installer experience

---

Built to be easy to run, easy to ship, and hard to stop playing.
