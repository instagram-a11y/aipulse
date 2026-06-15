#!/usr/bin/env python3
"""
AIPulse — feature image for the "team" section.
Philosophy: "Luminous Intelligence". The AIPulse wordmark woven with a living
gold pulse line, set in a constellation (the team as a connected network) on a
deep navy void. One pulse, many minds.

Output: public/images/team-aipulse.webp
"""
import math
import os
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONTS = "/Users/golenazresalei/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/6d165c0a-6434-4680-9ff5-e6cdfb9a0ee6/8aabb5d5-1117-472c-b47f-7cb56fc4fd4e/skills/canvas-design/canvas-fonts"

NAVY = (0x0B, 0x16, 0x22)
NAVY_MID = (0x11, 0x1F, 0x2E)
GOLD = (0xC9, 0xA8, 0x4C)
GOLD_LT = (0xE8, 0xD0, 0x8A)
WHITE = (0xF4, 0xF2, 0xEC)

W, H = 1600, 1200


def to_f(img):
    return np.asarray(img).astype(np.float32) / 255.0


def to_img(arr):
    return Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8))


def screen(a, b):
    return 1 - (1 - a) * (1 - b)


def vgrad():
    ys = np.linspace(0, 1, H)[:, None]
    top = np.array(NAVY_MID); bottom = np.array((0x07, 0x0E, 0x16)); mid = np.array(NAVY)
    col = top * (1 - ys) ** 1.3 + bottom * (ys) ** 1.3 + mid * (1 - (2 * ys - 1) ** 2) * 0.55
    arr = np.repeat(np.clip(col, 0, 255)[:, None, :], W, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def glow(paint, color, blurs, weights, gain=1.0):
    mask = Image.new("L", (W, H), 0)
    paint(ImageDraw.Draw(mask))
    acc = np.zeros((H, W), np.float32)
    for r, wgt in zip(blurs, weights):
        acc += np.asarray(mask.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255.0 * wgt
    acc = np.clip(acc * gain, 0, 1)
    return acc[:, :, None] * (np.array(color, np.float32) / 255.0)[None, None, :]


def vignette(img, strength=0.6, cx=0.5, cy=0.46):
    xx = (np.linspace(0, 1, W)[None, :] - cx)
    yy = (np.linspace(0, 1, H)[:, None] - cy)
    d = np.sqrt((xx * (W / H)) ** 2 + yy ** 2)
    v = np.clip(1 - (d / 0.95) ** 2 * strength, 1 - strength, 1)
    return to_img(to_f(img) * v[:, :, None])


def grain(img, amt=0.02):
    n = (np.random.default_rng().standard_normal((H, W)) * amt)[:, :, None]
    return to_img(np.clip(to_f(img) + n, 0, 1))


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


def main():
    rng = random.Random(7)
    base = to_f(vgrad())

    # faint grid
    g = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(g)
    for x in range(0, W, 70):
        gd.line([(x, 0), (x, H)], fill=tuple(int(v * 6 / 255) for v in GOLD))
    for y in range(0, H, 70):
        gd.line([(0, y), (W, y)], fill=tuple(int(v * 6 / 255) for v in GOLD))
    base = screen(base, to_f(g.filter(ImageFilter.GaussianBlur(0.4))))

    cx, cy = W * 0.5, H * 0.47

    # concentric rings radiating from the pulse
    def paint_rings(d):
        for i in range(14):
            r = (i + 1) * (H * 0.07)
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=int(70 - i * 3), width=2)
    base = screen(base, glow(paint_rings, GOLD, (3, 12, 30), (0.5, 0.4, 0.3), gain=0.5))

    # constellation (the team) — denser toward center
    nodes = []
    for _ in range(40):
        ang = rng.uniform(0, math.tau)
        rad = rng.uniform(0.10, 0.62) * H
        x = cx + math.cos(ang) * rad * 1.25
        y = cy + math.sin(ang) * rad
        if -20 < x < W + 20 and -20 < y < H + 20:
            nodes.append((x, y))
    edges = []
    for i, a in enumerate(nodes):
        near = sorted(nodes, key=lambda b: (b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)[1:3]
        for b in near:
            if rng.random() < 0.6:
                edges.append((a, b))

    def paint_edges(d):
        for a, b in edges:
            d.line([a, b], fill=70, width=2)

    def paint_nodes(d):
        for (x, y) in nodes:
            r = rng.uniform(2.5, 5.5)
            d.ellipse([x - r, y - r, x + r, y + r], fill=255)

    base = screen(base, glow(paint_edges, GOLD, (2, 9, 24), (0.6, 0.45, 0.3), gain=0.5))
    base = screen(base, glow(paint_nodes, GOLD_LT, (2, 6, 16, 40), (1, 0.85, 0.65, 0.45), gain=0.9))
    crisp = Image.new("RGB", (W, H), (0, 0, 0))
    cd = ImageDraw.Draw(crisp)
    for a, b in edges:
        cd.line([a, b], fill=tuple(int(v * 0.18) for v in GOLD), width=1)
    for (x, y) in nodes:
        cd.ellipse([x - 1.5, y - 1.5, x + 1.5, y + 1.5], fill=GOLD_LT)
    base = screen(base, to_f(crisp))

    # pulse line through the wordmark
    pulse_y = cy + H * 0.012
    pts = []
    x = -10
    while x <= W + 10:
        y = pulse_y + math.sin(x * 0.02) * H * 0.006
        dx = x - cx
        if -70 < dx < 70:
            y += (-math.exp(-((dx + 22) ** 2) / 120) * H * 0.03
                  + math.exp(-((dx) ** 2) / 30) * H * 0.16
                  - math.exp(-((dx - 22) ** 2) / 160) * H * 0.06)
        pts.append((x, y))
        x += 5

    def paint_pulse(d):
        d.line(pts, fill=255, width=5, joint="curve")
    base = screen(base, glow(paint_pulse, GOLD_LT, (2, 7, 20, 50), (1, 0.9, 0.7, 0.5), gain=1.05))
    pc = Image.new("RGB", (W, H), (0, 0, 0))
    ImageDraw.Draw(pc).line(pts, fill=GOLD_LT, width=3, joint="curve")
    base = screen(base, to_f(pc) * 0.85)

    img = to_img(np.clip(base, 0, 1)).convert("RGB")
    draw = ImageDraw.Draw(img)

    # ── Wordmark: "AIPulse" (AI white, Pulse gold) in CrimsonPro ──
    wf = font("CrimsonPro-Regular.ttf", 250)
    ai, pulse = "AI", "Pulse"
    w_ai = draw.textlength(ai, font=wf)
    w_pulse = draw.textlength(pulse, font=wf)
    total = w_ai + w_pulse
    x0 = cx - total / 2
    asc, desc = wf.getmetrics()
    ty = cy - (asc + desc) / 2

    # subtle dark plate behind wordmark for legibility against the network
    bbox = [x0 - 30, ty + asc - 250 * 0.78, x0 + total + 30, ty + asc + 250 * 0.30]
    plate = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(plate)
    pdraw.rounded_rectangle(bbox, radius=8, fill=(8, 16, 24, 120))
    plate = plate.filter(ImageFilter.GaussianBlur(18))
    img = Image.alpha_composite(img.convert("RGBA"), plate).convert("RGB")
    draw = ImageDraw.Draw(img)

    draw.text((x0, ty), ai, font=wf, fill=WHITE)
    draw.text((x0 + w_ai, ty), pulse, font=wf, fill=GOLD)

    # ── Tagline micro-label, tracked, beneath ──
    def tracked(s, sp=" "):
        return sp.join(list(s))
    tf = font("Jura-Light.ttf", 26)
    label = tracked("ONE PULSE")
    extra = "   ·   AI CONSULTING   ·   CANADA"
    full = label + tracked(extra) if False else label
    lw = draw.textlength(full, font=tf)
    ly = ty + asc + 250 * 0.30 + 46
    draw.text((cx - lw / 2, ly), full, font=tf, fill=GOLD_LT)
    # thin gold rules flanking the label
    rule_w = 60
    gap = 26
    ry = ly + 14
    draw.line([(cx - lw / 2 - gap - rule_w, ry), (cx - lw / 2 - gap, ry)], fill=tuple(int(v) for v in GOLD), width=1)
    draw.line([(cx + lw / 2 + gap, ry), (cx + lw / 2 + gap + rule_w, ry)], fill=tuple(int(v) for v in GOLD), width=1)

    # top eyebrow label
    ef = font("Jura-Light.ttf", 22)
    eb = tracked("ONE TEAM")
    ew = draw.textlength(eb, font=ef)
    draw.text((cx - ew / 2, cy - H * 0.30), eb, font=ef, fill=tuple(int(v * 0.7) for v in GOLD_LT))

    img = vignette(img, 0.62, 0.5, 0.47)
    img = grain(img, 0.018)

    out = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public", "images", "team-aipulse.webp"))
    img.save(out, "WEBP", quality=88, method=6)
    print("saved", out, f"{os.path.getsize(out)//1024} KB")


if __name__ == "__main__":
    main()
