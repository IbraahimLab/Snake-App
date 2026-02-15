from __future__ import annotations

import json
import logging
import os
import random
import re
import sys
import threading
import tkinter as tk
import webbrowser
from dataclasses import dataclass
from logging.handlers import RotatingFileHandler
from pathlib import Path
from tkinter import messagebox
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from version import APP_VERSION

BOARD_COLS = 30
BOARD_ROWS = 30
CELL_SIZE = 20
TICK_MS = 120

BG_COLOR = "#0b1220"
SNAKE_HEAD = "#52f89a"
SNAKE_BODY = "#2ec97c"
FOOD_COLOR = "#ff8b5e"
GRID_COLOR = "#1f2a3a"
TEXT_COLOR = "#e5efff"

UPDATE_API_URL = "https://api.github.com/repos/IbraahimLab/Snake-App/releases/latest"
RELEASES_URL = "https://github.com/IbraahimLab/Snake-App/releases/latest"

APP_DIR = Path(os.environ.get("LOCALAPPDATA", str(Path.home()))) / "SnakeApp"
LOG_DIR = APP_DIR / "logs"
LOG_FILE = LOG_DIR / "snake.log"
CONFIG_FILE = APP_DIR / "config.json"


@dataclass(frozen=True)
class Point:
    x: int
    y: int

    def move(self, direction: str) -> "Point":
        if direction == "Up":
            return Point(self.x, self.y - 1)
        if direction == "Down":
            return Point(self.x, self.y + 1)
        if direction == "Left":
            return Point(self.x - 1, self.y)
        return Point(self.x + 1, self.y)


def ensure_app_dirs() -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)


def configure_logging() -> logging.Logger:
    ensure_app_dirs()
    logger = logging.getLogger("snake_app")
    logger.setLevel(logging.INFO)
    logger.propagate = False

    if logger.handlers:
        return logger

    handler = RotatingFileHandler(LOG_FILE, maxBytes=256_000, backupCount=5, encoding="utf-8")
    formatter = logging.Formatter("%(asctime)s | %(levelname)s | %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    return logger


def install_crash_handler(logger: logging.Logger) -> None:
    def _handle_exception(exc_type, exc_value, exc_traceback) -> None:
        logger.exception(
            "Unhandled exception",
            exc_info=(exc_type, exc_value, exc_traceback),
        )
        try:
            messagebox.showerror(
                "Snake App crashed",
                f"An unexpected error occurred.\nLogs: {LOG_FILE}",
            )
        except tk.TclError:
            pass

    sys.excepthook = _handle_exception


def load_config(logger: logging.Logger) -> dict:
    default = {"high_score": 0}
    try:
        ensure_app_dirs()
        if not CONFIG_FILE.exists():
            return default
        with CONFIG_FILE.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
            if isinstance(data, dict):
                return {**default, **data}
            return default
    except (OSError, json.JSONDecodeError):
        logger.warning("Failed to load config, using defaults", exc_info=True)
        return default


def save_config(logger: logging.Logger, config: dict) -> None:
    try:
        ensure_app_dirs()
        with CONFIG_FILE.open("w", encoding="utf-8") as handle:
            json.dump(config, handle, indent=2)
    except OSError:
        logger.warning("Failed to save config", exc_info=True)


def parse_version(value: str) -> tuple[int, int, int]:
    parts = [int(p) for p in re.findall(r"\d+", value)]
    parts = (parts + [0, 0, 0])[:3]
    return parts[0], parts[1], parts[2]


def is_newer_version(latest: str, current: str) -> bool:
    return parse_version(latest) > parse_version(current)


class SnakeApp(tk.Tk):
    def __init__(self, logger: logging.Logger):
        super().__init__()
        self.logger = logger
        self.config_data = load_config(logger)

        self.title(f"Snake App {APP_VERSION}")
        self.geometry(f"{BOARD_COLS * CELL_SIZE + 32}x{BOARD_ROWS * CELL_SIZE + 126}")
        self.resizable(False, False)
        self.configure(bg=BG_COLOR)

        self.score = 0
        self.high_score = int(self.config_data.get("high_score", 0))
        self.direction = "Right"
        self.next_direction = "Right"
        self.snake: list[Point] = []
        self.food = Point(0, 0)
        self.paused = False
        self.game_over = False
        self.tick_job: str | None = None
        self.latest_release_url = RELEASES_URL
        self.latest_release_tag = ""

        self.score_var = tk.StringVar(value="Score: 0")
        self.high_score_var = tk.StringVar(value=f"Best: {self.high_score}")
        self.status_var = tk.StringVar(value="Arrows/WASD move. Space pauses. R restarts.")

        self._build_ui()
        self._bind_keys()
        self.restart_game(initial=True)
        self.after(1000, self.check_for_updates_async)

    def _build_ui(self) -> None:
        hud = tk.Frame(self, bg=BG_COLOR)
        hud.pack(fill="x", padx=16, pady=(14, 8))

        tk.Label(
            hud,
            textvariable=self.score_var,
            bg=BG_COLOR,
            fg=TEXT_COLOR,
            font=("Segoe UI", 11, "bold"),
        ).pack(side="left")

        tk.Label(
            hud,
            textvariable=self.high_score_var,
            bg=BG_COLOR,
            fg=TEXT_COLOR,
            font=("Segoe UI", 11, "bold"),
        ).pack(side="left", padx=(16, 0))

        self.update_button = tk.Button(
            hud,
            text="Update available",
            font=("Segoe UI", 9, "bold"),
            bg="#1f8f57",
            fg="white",
            activebackground="#186e43",
            activeforeground="white",
            relief="flat",
            cursor="hand2",
            command=self.open_latest_release,
        )
        self.update_button.pack(side="right")
        self.update_button.pack_forget()

        self.canvas = tk.Canvas(
            self,
            width=BOARD_COLS * CELL_SIZE,
            height=BOARD_ROWS * CELL_SIZE,
            bg=BG_COLOR,
            highlightthickness=1,
            highlightbackground=GRID_COLOR,
        )
        self.canvas.pack(padx=16, pady=(0, 10))

        tk.Label(
            self,
            textvariable=self.status_var,
            bg=BG_COLOR,
            fg="#bcd1ef",
            font=("Segoe UI", 9),
            anchor="w",
        ).pack(fill="x", padx=16, pady=(0, 12))

    def _bind_keys(self) -> None:
        directions = {
            "<Up>": "Up",
            "<w>": "Up",
            "<W>": "Up",
            "<Down>": "Down",
            "<s>": "Down",
            "<S>": "Down",
            "<Left>": "Left",
            "<a>": "Left",
            "<A>": "Left",
            "<Right>": "Right",
            "<d>": "Right",
            "<D>": "Right",
        }
        for key, direction in directions.items():
            self.bind(key, lambda _event, value=direction: self.queue_direction(value))

        self.bind("<space>", self.toggle_pause)
        self.bind("<p>", self.toggle_pause)
        self.bind("<P>", self.toggle_pause)
        self.bind("<r>", self.restart_game)
        self.bind("<R>", self.restart_game)
        self.bind("<Escape>", lambda _event: self.on_close())

    def restart_game(self, _event=None, initial: bool = False) -> None:
        if self.tick_job is not None:
            self.after_cancel(self.tick_job)
            self.tick_job = None

        center_x = BOARD_COLS // 2
        center_y = BOARD_ROWS // 2
        self.snake = [
            Point(center_x - 1, center_y),
            Point(center_x, center_y),
            Point(center_x + 1, center_y),
        ]
        self.direction = "Right"
        self.next_direction = "Right"
        self.score = 0
        self.paused = False
        self.game_over = False
        self.food = self.spawn_food()
        self.update_hud()
        self.status_var.set("Arrows/WASD move. Space pauses. R restarts.")
        self.render()
        self.tick_job = self.after(TICK_MS, self.game_tick)
        if not initial:
            self.logger.info("Game restarted")

    def queue_direction(self, direction: str) -> None:
        if self.game_over:
            return
        opposite = {
            "Up": "Down",
            "Down": "Up",
            "Left": "Right",
            "Right": "Left",
        }
        if direction == opposite.get(self.next_direction):
            return
        self.next_direction = direction

    def toggle_pause(self, _event=None) -> None:
        if self.game_over:
            return
        self.paused = not self.paused
        if self.paused:
            self.status_var.set("Paused. Press Space to continue.")
        else:
            self.status_var.set("Arrows/WASD move. Space pauses. R restarts.")
            if self.tick_job is None:
                self.tick_job = self.after(TICK_MS, self.game_tick)
        self.render()

    def game_tick(self) -> None:
        self.tick_job = None
        if self.paused or self.game_over:
            return

        self.direction = self.next_direction
        new_head = self.snake[-1].move(self.direction)
        if self._is_collision(new_head):
            self.handle_game_over()
            self.render()
            return

        self.snake.append(new_head)
        if new_head == self.food:
            self.score += 10
            self.update_hud()
            self.food = self.spawn_food()
        else:
            self.snake.pop(0)

        self.render()
        self.tick_job = self.after(TICK_MS, self.game_tick)

    def _is_collision(self, point: Point) -> bool:
        outside = point.x < 0 or point.x >= BOARD_COLS or point.y < 0 or point.y >= BOARD_ROWS
        return outside or point in self.snake

    def handle_game_over(self) -> None:
        self.game_over = True
        self.status_var.set("Game over. Press R to restart or Esc to exit.")
        self.persist_high_score()
        self.logger.info("Game over with score %s", self.score)

    def spawn_food(self) -> Point:
        snake_set = set(self.snake)
        available = [
            Point(x, y)
            for y in range(BOARD_ROWS)
            for x in range(BOARD_COLS)
            if Point(x, y) not in snake_set
        ]
        if not available:
            self.game_over = True
            return self.snake[-1]
        return random.choice(available)

    def persist_high_score(self) -> None:
        if self.score <= self.high_score:
            return
        self.high_score = self.score
        self.config_data["high_score"] = self.high_score
        save_config(self.logger, self.config_data)
        self.high_score_var.set(f"Best: {self.high_score}")

    def update_hud(self) -> None:
        self.score_var.set(f"Score: {self.score}")
        self.high_score_var.set(f"Best: {self.high_score}")

    def draw_cell(self, point: Point, color: str) -> None:
        x1 = point.x * CELL_SIZE
        y1 = point.y * CELL_SIZE
        x2 = x1 + CELL_SIZE
        y2 = y1 + CELL_SIZE
        self.canvas.create_rectangle(
            x1 + 1,
            y1 + 1,
            x2 - 1,
            y2 - 1,
            fill=color,
            outline="",
        )

    def render(self) -> None:
        self.canvas.delete("all")

        width = BOARD_COLS * CELL_SIZE
        height = BOARD_ROWS * CELL_SIZE
        for x in range(0, width + 1, CELL_SIZE):
            self.canvas.create_line(x, 0, x, height, fill=GRID_COLOR)
        for y in range(0, height + 1, CELL_SIZE):
            self.canvas.create_line(0, y, width, y, fill=GRID_COLOR)

        self.draw_cell(self.food, FOOD_COLOR)
        for index, part in enumerate(self.snake):
            color = SNAKE_HEAD if index == len(self.snake) - 1 else SNAKE_BODY
            self.draw_cell(part, color)

        if self.paused:
            self._draw_overlay("Paused")
        if self.game_over:
            self._draw_overlay("Game Over")

    def _draw_overlay(self, text: str) -> None:
        width = BOARD_COLS * CELL_SIZE
        height = BOARD_ROWS * CELL_SIZE
        self.canvas.create_rectangle(0, 0, width, height, fill="#000000", stipple="gray50", outline="")
        self.canvas.create_text(
            width / 2,
            height / 2,
            text=text,
            fill="white",
            font=("Segoe UI", 28, "bold"),
        )

    def check_for_updates_async(self) -> None:
        thread = threading.Thread(target=self._check_for_updates, daemon=True)
        thread.start()

    def _check_for_updates(self) -> None:
        try:
            request = Request(
                UPDATE_API_URL,
                headers={
                    "Accept": "application/vnd.github+json",
                    "User-Agent": f"SnakeApp/{APP_VERSION}",
                },
            )
            with urlopen(request, timeout=6) as response:
                data = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, OSError, TimeoutError, json.JSONDecodeError):
            self.logger.info("Release check failed", exc_info=True)
            return

        latest_tag = str(data.get("tag_name", "")).strip()
        release_url = str(data.get("html_url", RELEASES_URL)).strip() or RELEASES_URL
        if latest_tag and is_newer_version(latest_tag, APP_VERSION):
            self.latest_release_tag = latest_tag
            self.latest_release_url = release_url
            self.after(0, self.show_update_badge)

    def show_update_badge(self) -> None:
        text = f"Update {self.latest_release_tag} available"
        self.update_button.configure(text=text)
        if not self.update_button.winfo_ismapped():
            self.update_button.pack(side="right")
        self.status_var.set(f"New version {self.latest_release_tag} is ready.")

    def open_latest_release(self) -> None:
        webbrowser.open(self.latest_release_url, new=2)

    def on_close(self) -> None:
        self.persist_high_score()
        self.logger.info("Closing Snake App")
        self.destroy()


def main() -> None:
    logger = configure_logging()
    install_crash_handler(logger)
    logger.info("Starting Snake App v%s", APP_VERSION)

    app = SnakeApp(logger)
    app.protocol("WM_DELETE_WINDOW", app.on_close)
    app.mainloop()


if __name__ == "__main__":
    main()
