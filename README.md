# Snake App

Desktop Snake game for Windows (Tkinter) with a React landing page for Vercel deployment.

## Repo Layout

- `app/`: desktop game source
- `installer/`: Inno Setup script
- `scripts/`: local build helpers
- `landing/`: React marketing/download page
- `.github/workflows/release.yml`: tag-based release pipeline

## Run Desktop App Locally

```bash
python app/main.py
```

Controls:

- Arrow keys / WASD: move
- `Space` or `P`: pause
- `R`: restart
- `Esc`: exit

## Build Windows Executable Locally

```bash
scripts\build_windows.bat
```

Outputs:

- `dist/SnakeApp.exe` (standalone exe)
- `release/SnakeApp-portable-windows-x64.zip`

To build an installer locally, install Inno Setup and run:

```bash
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer\SnakeApp.iss
```

Output:

- `release/SnakeApp-Setup.exe`

## Publish Release (GitHub)

1. Commit and push `main`.
2. Create and push a tag:
   - `git tag -a v1.0.0 -m "First release"`
   - `git push origin v1.0.0`
3. GitHub Actions builds and uploads:
   - installer exe
   - portable zip
   - checksums

## Optional Code Signing in CI

Add these repo secrets:

- `WINDOWS_CERT_BASE64`: base64-encoded `.pfx`
- `WINDOWS_CERT_PASSWORD`: cert password

If missing, release is still published unsigned.

## Landing Page (React + Vercel)

Local dev:

```bash
cd landing
npm install
npm run dev
```

Production build:

```bash
cd landing
npm run build
```

Deploy to Vercel:

1. Import this GitHub repo in Vercel.
2. Set **Root Directory** to `landing`.
3. Deploy.

The download button points to:

- `https://github.com/IbraahimLab/Snake-App/releases/latest`
