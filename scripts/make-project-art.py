#!/usr/bin/env python3
"""Draw the six project-card pictures for the homepage gallery.

Each picture is a line-art scene about the project (bone-white strokes, vermilion
accent, soft glow) laid over one of the existing night-temple stills so the cards
share the page's palette. Output: public/landing-pages/secret-pathways-assets/generated/project-*.webp

    python3 scripts/make-project-art.py
"""
from __future__ import annotations

import math
import pathlib
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
GEN = ROOT / "public/landing-pages/secret-pathways-assets/generated"
W, H, K = 1000, 562, 2  # 16:9 card picture; motifs are drawn in a 1000x1250 space and fitted into it
BONE = (223, 231, 224)
DIM = (150, 160, 154)
RED = (232, 52, 38)
EMBER = (255, 160, 110)
MONO = "/System/Library/Fonts/Menlo.ttc"
INSET = 0.66  # motif size relative to the card picture; the rest is margin


class Art:
    def __init__(self, bg_name: str, focus: tuple[float, float], zoom: float = 1.0, k: float = 1.0, cy: float = 625):
        """k scales the motif about (500, cy) so it fits the 16:9 frame."""
        self.k, self.cy = k * INSET, cy  # every motif is shrunk so a dark margin surrounds it
        src = Image.open(GEN / bg_name).convert("RGB")
        sw, sh = src.size
        cw = min(sw, sh * W / H) / zoom
        ch = cw * H / W
        x0 = max(0, min(sw - cw, focus[0] * sw - cw / 2))
        y0 = max(0, min(sh - ch, focus[1] * sh - ch / 2))
        bg = src.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W * K, H * K), Image.LANCZOS)
        # a solid, near-opaque panel: the still only tints it, so the card reads as an object, not a window
        panel = Image.new("RGB", bg.size, (9, 12, 16))
        self.base = Image.blend(panel, bg, 0.22).convert("RGBA")
        self.layer = Image.new("RGBA", bg.size, (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.layer)

    # --- primitives, in the 1000x1250 motif space ---
    def _pt(self, x, y):
        return ((500 + (x - 500) * self.k) * K, (H / 2 + (y - self.cy) * self.k) * K)

    def _p(self, pts):
        return [self._pt(x, y) for x, y in pts]

    def _w(self, w):
        return max(2, int(round(max(2.0, w * self.k * 1.15) * K)))

    def line(self, pts, color=BONE, w=3, alpha=255):
        self.d.line(self._p(pts), fill=color + (alpha,), width=self._w(w), joint="curve")

    def poly(self, pts, fill=None, outline=BONE, w=3, alpha=255, fill_alpha=0):
        p = self._p(pts)
        if fill:
            self.d.polygon(p, fill=fill + (fill_alpha,))
        if outline:
            self.d.line(p + [p[0]], fill=outline + (alpha,), width=self._w(w), joint="curve")

    def rect(self, x0, y0, x1, y1, r=14, outline=BONE, w=3, fill=None, fill_alpha=0, alpha=255):
        (ax, ay), (bx, by) = self._pt(x0, y0), self._pt(x1, y1)
        self.d.rounded_rectangle([ax, ay, bx, by], radius=r * self.k * K,
                                 outline=(outline + (alpha,)) if outline else None, width=self._w(w),
                                 fill=(fill + (fill_alpha,)) if fill else None)

    def _box(self, cx, cy, r):
        (ax, ay), (bx, by) = self._pt(cx - r, cy - r), self._pt(cx + r, cy + r)
        return [ax, ay, bx, by]

    def circle(self, cx, cy, r, outline=BONE, w=3, fill=None, fill_alpha=0, alpha=255):
        self.d.ellipse(self._box(cx, cy, r), outline=(outline + (alpha,)) if outline else None, width=self._w(w),
                       fill=(fill + (fill_alpha,)) if fill else None)

    def arc(self, cx, cy, r, a0, a1, color=BONE, w=3, alpha=255):
        self.d.arc(self._box(cx, cy, r), a0, a1, fill=color + (alpha,), width=self._w(w))

    def dashed_circle(self, cx, cy, r, color=DIM, w=2, n=48, alpha=200):
        step = 360 / n
        for i in range(n):
            if i % 2 == 0:
                self.arc(cx, cy, r, i * step, (i + 1) * step, color, w, alpha)

    def text(self, xy, s, size=26, color=BONE, alpha=255):
        f = ImageFont.truetype(MONO, max(10, int(size * self.k * 1.1 * K)))
        self.d.text(self._pt(*xy), s, font=f, fill=color + (alpha,))

    def save(self, name: str):
        glow = self.layer.filter(GaussianBlur(10 * K))
        glow2 = self.layer.filter(GaussianBlur(3 * K))
        out = Image.alpha_composite(self.base, glow)
        out = Image.alpha_composite(out, glow2)
        out = Image.alpha_composite(out, self.layer)
        out = out.convert("RGB").resize((800, 450), Image.LANCZOS)
        out.save(GEN / name, "WEBP", quality=88, method=6)
        print("wrote", name)


GaussianBlur = ImageFilter.GaussianBlur


# ------------------------------------------------------------------ DevLaunch
def devlaunch():
    a = Art("kage-approach.webp", (0.5, 0.5), k=0.74, cy=516)
    cx, cy, s = 500, 640, 112
    w = s * 0.866

    def proj(gx, gy, gz):
        return cx + (gx - gy) * w, cy + (gx + gy) * s / 2 - gz * s

    def cube(gx, gy, gz, hot=False):
        x, y = proj(gx, gy, gz)
        A, B, C, D = (x, y - s), (x + w, y - s / 2), (x, y), (x - w, y - s / 2)
        B2, C2, D2 = (x + w, y + s / 2), (x, y + s), (x - w, y + s / 2)
        faces = [([A, B, C, D], 40), ([D, C, C2, D2], 18), ([C, B, B2, C2], 8)]
        for pts, fa in faces:
            a.poly(pts, fill=RED if hot else BONE, outline=RED if hot else BONE,
                   w=3, fill_alpha=(fa * 3 if hot else fa // 2), alpha=255 if hot else 215)
        # container ribs
        for t in (0.33, 0.66):
            a.line([(D[0] + (C[0] - D[0]) * t, D[1] + (C[1] - D[1]) * t),
                    (D2[0] + (C2[0] - D2[0]) * t, D2[1] + (C2[1] - D2[1]) * t)],
                   color=RED if hot else BONE, w=1.5, alpha=150)

    order = [(0, 0, 0), (1, 0, 0), (0, 1, 0), (1, 1, 0), (0, 0, 1), (1, 0, 1), (0, 1, 1), (0, 0, 2)]
    for gx, gy, gz in sorted(order, key=lambda p: (p[2], p[0] + p[1])):
        cube(gx, gy, gz, hot=(gx, gy, gz) == (0, 0, 2))
    # launch trail above the hot cube
    tx, ty = proj(0, 0, 2)
    top = ty - s - 30
    for i, yy in enumerate(range(int(top), 235, -34)):
        a.line([(tx, yy), (tx, yy - 16)], color=EMBER, w=3, alpha=max(40, 230 - i * 22))
    a.line([(tx - 24, 228), (tx, 184), (tx + 24, 228)], color=EMBER, w=4)
    a.circle(tx, 160, 6, outline=None, fill=EMBER, fill_alpha=255)
    a.save("project-devlaunch.webp")


# ------------------------------------------------------------------------ ARC
def arc_project():
    a = Art("kage-lantern-court.webp", (0.55, 0.5), k=0.7, cy=518)
    hx, hy = 500, 590
    rnd = random.Random(7)
    for k, ang in enumerate((-90, 30, 150)):
        cx = hx + 300 * math.cos(math.radians(ang))
        cy = hy + 300 * math.sin(math.radians(ang)) * 0.95
        a.dashed_circle(cx, cy, 150, DIM, 2.5, 56, 210)
        pts = []
        for _ in range(6):
            r = rnd.uniform(25, 105)
            t = rnd.uniform(0, math.tau)
            pts.append((cx + r * math.cos(t), cy + r * math.sin(t)))
        for i, p in enumerate(pts):
            for q in pts[i + 1:i + 3]:
                a.line([p, q], color=BONE, w=1.6, alpha=120)
        for p in pts:
            a.circle(p[0], p[1], 8, outline=BONE, w=2.5, fill=BONE, fill_alpha=60)
        # the gate where this tenant meets the hub: a diamond on the spoke
        dx, dy = hx - cx, hy - cy
        n = math.hypot(dx, dy)
        ux, uy = dx / n, dy / n
        ex, ey = cx + ux * 150, cy + uy * 150
        mx, my = hx - ux * 70, hy - uy * 70
        a.line([(ex, ey), (mx, my)], color=EMBER, w=2.5, alpha=200)
        gx, gy = (ex + mx) / 2, (ey + my) / 2
        a.poly([(gx, gy - 14), (gx + 14, gy), (gx, gy + 14), (gx - 14, gy)], fill=RED, outline=EMBER, w=2.5, fill_alpha=200)
    # the hub: the shared "company brain"
    a.circle(hx, hy, 66, outline=RED, w=4, fill=RED, fill_alpha=45)
    a.circle(hx, hy, 40, outline=EMBER, w=3)
    a.circle(hx, hy, 13, outline=None, fill=EMBER, fill_alpha=255)
    a.save("project-arc.webp")


# ----------------------------------------------------------------- Stock-Watch
def stockwatch():
    a = Art("kage-moonwater.webp", (0.5, 0.45), k=0.8, cy=522)
    x0, x1, y0, y1 = 130, 870, 330, 790
    for i in range(5):
        y = y0 + i * (y1 - y0) / 4
        a.line([(x0, y), (x1, y)], color=DIM, w=1.2, alpha=70)
    a.line([(x0, y0), (x0, y1)], color=DIM, w=2, alpha=150)
    a.line([(x0, y1), (x1, y1)], color=DIM, w=2, alpha=150)
    # availability signal: out of stock (flat, low), then back in stock (steps up)
    pts = [(x0, 740), (230, 745), (330, 738), (430, 742), (520, 735), (590, 520), (660, 470), (750, 430), (x1, 395)]
    area = pts + [(x1, y1), (x0, y1)]
    a.poly(area, fill=RED, outline=None, fill_alpha=46)
    a.line(pts, color=EMBER, w=5)
    a.text((140, 805), "OUT OF STOCK", 24, DIM, 190)
    a.text((600, 805), "IN STOCK", 24, EMBER, 230)
    # the bell goes off at the moment of the step
    bx, by = 592, 330
    a.line([(bx, by - 58), (bx, by - 40)], color=BONE, w=4)
    a.poly([(bx - 46, by + 36), (bx - 40, by + 8), (bx - 24, by - 32), (bx, by - 42),
            (bx + 24, by - 32), (bx + 40, by + 8), (bx + 46, by + 36)], fill=RED, outline=BONE, w=4, fill_alpha=80)
    a.line([(bx - 56, by + 36), (bx + 56, by + 36)], color=BONE, w=4)
    a.circle(bx, by + 56, 10, outline=BONE, w=3, fill=BONE, fill_alpha=200)
    a.arc(bx, by - 4, 78, 200, 250, EMBER, 4)
    a.arc(bx, by - 4, 78, 290, 340, EMBER, 4)
    a.arc(bx, by - 4, 106, 205, 245, EMBER, 3, 160)
    a.arc(bx, by - 4, 106, 295, 335, EMBER, 3, 160)
    # message plane (Telegram)
    px, py = 810, 250
    a.poly([(px - 56, py + 8), (px + 58, py - 36), (px + 22, py + 52), (px + 2, py + 20)], fill=BONE, outline=BONE, w=3, fill_alpha=40)
    a.line([(px + 58, py - 36), (px + 2, py + 20)], color=BONE, w=2.5)
    a.line([(px + 2, py + 20), (px - 4, py + 54), (px - 22, py + 28)], color=BONE, w=2.5, alpha=200)
    a.save("project-stockwatch.webp")


# --------------------------------------------------------------- Prompt Engine
def prompt_engine():
    a = Art("kage-sanmon-preview.webp", (0.5, 0.45), k=1.1, cy=540)
    rnd = random.Random(3)
    # rough request
    a.rect(90, 340, 410, 740, 18, outline=DIM, w=3, alpha=220)
    y = 392
    for _ in range(8):
        n = rnd.randint(2, 4)
        x = 122
        for _ in range(n):
            ln = rnd.randint(30, 80)
            a.line([(x, y + rnd.randint(-2, 2)), (x + ln, y + rnd.randint(-3, 3))], color=DIM, w=4, alpha=170)
            x += ln + 14
            if x > 360:
                break
        y += 38
    a.text((110, 700), "fix the login thing", 22, DIM, 150)
    # arrow with a small gate (the scope check)
    a.line([(425, 540), (575, 540)], color=EMBER, w=4)
    a.line([(550, 512), (578, 540), (550, 568)], color=EMBER, w=4)
    a.poly([(500, 514), (514, 540), (500, 566), (486, 540)], fill=RED, outline=EMBER, w=2.5, fill_alpha=220)
    # precise prompt
    a.rect(590, 340, 910, 740, 18, outline=BONE, w=3.5)
    a.line([(622, 392), (700, 392)], color=RED, w=7)
    rows = [(622, 440, 860), (640, 484, 840), (640, 520, 800), (622, 576, 780), (640, 620, 850), (640, 656, 760)]
    for x, yy, xe in rows:
        if x == 640:
            a.rect(x - 16, yy - 3, x - 8, yy + 5, 2, outline=None, fill=EMBER, fill_alpha=255)
        a.line([(x, yy), (xe, yy)], color=BONE, w=4, alpha=200)
    a.rect(868, 690, 886, 716, 2, outline=None, fill=EMBER, fill_alpha=255)
    a.save("project-prompt-engine.webp")


# ------------------------------------------------------- Reliability Benchmark
def benchmark():
    a = Art("kage-approach.webp", (0.3, 0.6), 1.25, k=0.7, cy=640)
    gx, gy, r = 500, 520, 230
    a.arc(gx, gy, r, 180, 360, DIM, 6, 200)
    a.arc(gx, gy, r, 180, 292, EMBER, 9)
    for i in range(0, 11):
        ang = math.radians(180 + i * 18)
        p0 = (gx + (r - 22) * math.cos(ang), gy + (r - 22) * math.sin(ang))
        p1 = (gx + (r + 4) * math.cos(ang), gy + (r + 4) * math.sin(ang))
        a.line([p0, p1], color=BONE, w=2.5, alpha=180)
    na = math.radians(292)
    a.line([(gx, gy), (gx + (r - 40) * math.cos(na), gy + (r - 40) * math.sin(na))], color=BONE, w=5)
    a.circle(gx, gy, 16, outline=BONE, w=4, fill=RED, fill_alpha=255)
    a.text((gx - 52, gy + 40), "92%", 40, BONE, 230)
    # repeated runs: a grid where every cell is a graded answer
    cols, rows = 10, 4
    cw, gap = 62, 14
    gx0 = 500 - (cols * cw + (cols - 1) * gap) / 2
    rnd = random.Random(11)
    for rr in range(rows):
        for cc in range(cols):
            x = gx0 + cc * (cw + gap)
            y = 700 + rr * (cw + gap)
            ok = rnd.random() > 0.14
            a.rect(x, y, x + cw, y + cw, 8, outline=EMBER if ok else DIM, w=2.5,
                   fill=RED if ok else None, fill_alpha=70 if ok else 0, alpha=230 if ok else 160)
            if ok:
                a.line([(x + 16, y + 32), (x + 27, y + 43), (x + 47, y + 20)], color=BONE, w=3.5, alpha=220)
            else:
                a.line([(x + 18, y + 18), (x + 44, y + 44)], color=DIM, w=3, alpha=180)
                a.line([(x + 44, y + 18), (x + 18, y + 44)], color=DIM, w=3, alpha=180)
    a.save("project-benchmark.webp")


# ----------------------------------------------------------- Smart Agriculture
def agriculture():
    a = Art("kage-moonwater.webp", (0.78, 0.5), 1.1, k=0.64, cy=625)
    cx, cy, sz = 430, 610, 230
    x0, y0, x1, y1 = cx - sz / 2, cy - sz / 2, cx + sz / 2, cy + sz / 2
    for i in range(6):
        t = (i + 1) / 7
        for (px, py, qx, qy) in [
            (x0 + sz * t, y0, x0 + sz * t, y0 - 32), (x0 + sz * t, y1, x0 + sz * t, y1 + 32),
            (x0, y0 + sz * t, x0 - 32, y0 + sz * t), (x1, y0 + sz * t, x1 + 32, y0 + sz * t)]:
            a.line([(px, py), (qx, qy)], color=BONE, w=4, alpha=200)
    a.rect(x0, y0, x1, y1, 16, outline=BONE, w=4, fill=RED, fill_alpha=40)
    a.rect(cx - 62, cy - 62, cx + 62, cy + 62, 8, outline=EMBER, w=3)
    a.circle(cx, cy, 14, outline=None, fill=EMBER, fill_alpha=255)
    for k in range(3):
        a.line([(cx - 40, cy - 30 + k * 30), (cx - 24, cy - 30 + k * 30)], color=EMBER, w=3, alpha=170)
        a.line([(cx + 24, cy - 30 + k * 30), (cx + 40, cy - 30 + k * 30)], color=EMBER, w=3, alpha=170)
    # LoRa: long-range radio rings leaving the board
    ox, oy = x1 + 40, y0 - 40
    for i, rr in enumerate((70, 120, 170, 220)):
        a.arc(ox, oy, rr, 288, 356, EMBER, 4, max(60, 235 - i * 55))
    a.circle(ox, oy, 8, outline=None, fill=EMBER, fill_alpha=255)
    # the crop it watches
    sx, sy = 500, 1000
    a.line([(sx, sy), (sx - 4, sy - 130), (sx + 6, sy - 230)], color=BONE, w=5)
    for sgn, yy in ((-1, sy - 120), (1, sy - 180)):
        pts = [(sx + 2 * sgn, yy), (sx + 60 * sgn, yy - 26), (sx + 112 * sgn, yy - 14),
               (sx + 70 * sgn, yy + 26)]
        a.poly(pts, fill=BONE, outline=BONE, w=3, fill_alpha=34, alpha=220)
        a.line([(sx + 2 * sgn, yy), (sx + 100 * sgn, yy - 8)], color=BONE, w=1.8, alpha=140)
    a.line([(150, sy + 4), (850, sy + 4)], color=DIM, w=2.5, alpha=170)
    a.save("project-agriculture.webp")


if __name__ == "__main__":
    devlaunch()
    arc_project()
    stockwatch()
    prompt_engine()
    benchmark()
    agriculture()
