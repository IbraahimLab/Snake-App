@echo off
setlocal

echo [1/3] Installing build dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements-dev.txt

echo [2/3] Building standalone executable...
pyinstaller app\main.py --name SnakeApp --windowed --onefile --clean --noconfirm

if not exist release mkdir release

echo [3/3] Creating portable zip...
pwsh -NoProfile -Command "Compress-Archive -Path 'dist/SnakeApp.exe' -DestinationPath 'release/SnakeApp-portable-windows-x64.zip' -Force"

echo Build complete.
echo - EXE: dist\SnakeApp.exe
echo - ZIP: release\SnakeApp-portable-windows-x64.zip
