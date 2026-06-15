#!/usr/bin/env python3
"""
AIPulse — procedural background generator.
Philosophy: "Luminous Intelligence" (see design/luminous-intelligence.md).
Deep navy void + scarce gold signal (pulse waves, neural constellations,
concentric rings, perspective mesh). Additive glow, film grain, vignette.

Output: public/images/bg/*.webp  (+ a contact sheet montage.webp)
"""
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

# ── palette ───────────────────────────────────────────────────
NAVY      = (0x0B, 0x16, 0x22)
NAVY_MID  = (0x11, 0x1F, 0x2E)
NAVY_SOFT = (0x1A, 0x2E, 0x42)
GOLD      = (0xC9, 0xA8, 0x4C)
GOLD_LT   = (0xE8, 0xD0, 0x8A)

W, H = 2560, 1440
SS = 1  # supersample factor for crisp lines (kept 1 for speed; lines drawn wide)


# ── helpers ───────────────────────────────────────────────────
def vgrad(size, top, mid, bottom):
    w, h = size
    ys = np.linspace(0, 1, h)[:, None]
    top = np.array(top); mid = np.array(mid); bottom = np.array(bottom)
    # piecewise: top->mid (0..0.5), mid->bottom (0.5..1)
    a = np.clip(ys / 0.5, 0, 1)
    b = np.clip((ys - 0.5) / 0.5, 0, 1)
    col = (top * (1 - a) + mid * a) * (1 - b) + (mid * (1 - b) + bottom * b) * b
    # simpler smooth blend:
    col = top * (1 - ys) ** 1.3 + bottom * (ys) ** 1.3 + mid * (1 - (2 * ys - 1) ** 2) * 0.6
    col = np.clip(col, 0, 255)
    arr = np.repeat(col[:, None, :], w, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def to_f(img):
    return np.asarray(img).astype(np.float32) / 255.0


def to_img(arr):
    return Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8), "RGB")


def screen(base_f, layer_f):
    return 1 - (1 - base_f) * (1 - layer_f)


def glow_layer(size, paint, color, blurs=(2, 6, 16, 40), weights=(1.0, 0.8, 0.6, 0.45), gain=1.0):
    """Draw white shapes via paint(draw); bloom them; tint with color. Returns float RGB."""
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    paint(d)
    acc = np.zeros((size[1], size[0]), np.float32)
    for r, wgt in zip(blurs, weights):
        b = mask.filter(ImageFilter.GaussianBlur(r))
        acc += np.asarray(b, np.float32) / 255.0 * wgt
    acc = np.clip(acc * gain, 0, 1)
    col = np.array(color, np.float32) / 255.0
    return acc[:, :, None] * col[None, None, :]


def radial_vignette(img, strength=0.55, cx=0.5, cy=0.42, radius=0.95):
    w, h = img.size
    xx = (np.linspace(0, 1, w)[None, :] - cx)
    yy = (np.linspace(0, 1, h)[:, None] - cy)
    d = np.sqrt((xx * (w / h)) ** 2 + yy ** 2)
    v = np.clip(1 - (d / radius) ** 2 * strength, 1 - strength, 1)
    f = to_f(img) * v[:, :, None]
    return to_img(f)


def add_grain(img, amount=0.022):
    arr = to_f(img)
    n = (np.random.default_rng().standard_normal(arr.shape[:2]) * amount)[:, :, None]
    return to_img(np.clip(arr + n, 0, 1))


def faint_grid(size, step=64, color=GOLD, alpha=8):
    """very subtle grid lines, returned as float RGB to screen on."""
    img = Image.new("RGB", size, (0, 0, 0))
    d = ImageDraw.Draw(img)
    c = tuple(int(v * alpha / 255) for v in color)
    for x in range(0, size[0], step):
        d.line([(x, 0), (x, size[1])], fill=c, width=1)
    for y in range(0, size[1], step):
        d.line([(0, y), (size[0], y)], fill=c, width=1)
    return to_f(img.filter(ImageFilter.GaussianBlur(0.5)))


def base_canvas(size, seed=0):
    img = vgrad(size, NAVY, NAVY_MID, (0x08, 0x10, 0x19))
    f = to_f(img)
    f = screen(f, faint_grid(size, step=72, alpha=6))
    return f


def finish(f, size, vig=0.6, grain=0.02, cx=0.5, cy=0.42):
    img = to_img(np.clip(f, 0, 1))
    img = radial_vignette(img, strength=vig, cx=cx, cy=cy)
    img = add_grain(img, grain)
    return img


def lerp(a, b, t):
    return tuple(a[i] + (b[i] - a[i]) * t for i in range(len(a)))


# ── scenes ────────────────────────────────────────────────────
def scene_pulse(size, seed=11):
    rng = random.Random(seed)
    w, h = size
    base = base_canvas(size, seed)
    baseline = int(h * 0.60)
    amp_small = h * 0.012
    pts = []
    x = 0
    # build an ECG-like path
    step = 6
    spikes = sorted(rng.sample(range(int(w * 0.12), int(w * 0.92), 12), 5))
    while x <= w:
        y = baseline + math.sin(x * 0.012 + seed) * amp_small + math.sin(x * 0.041) * amp_small * 0.5
        for s in spikes:
            dx = x - s
            if -36 < dx < 36:
                # QRS complex
                y += (-math.exp(-((dx + 10) ** 2) / 30) * h * 0.02
                      + math.exp(-((dx) ** 2) / 12) * h * 0.16
                      - math.exp(-((dx - 12) ** 2) / 40) * h * 0.05)
        pts.append((x, y))
        x += step

    def paint(d):
        d.line(pts, fill=255, width=5, joint="curve")

    glow = glow_layer(size, paint, GOLD_LT, blurs=(2, 7, 20, 55),
                      weights=(1.0, 0.9, 0.7, 0.55), gain=1.15)
    f = screen(base, glow)
    # crisp core
    core = Image.new("RGB", size, (0, 0, 0))
    ImageDraw.Draw(core).line(pts, fill=GOLD_LT, width=3, joint="curve")
    f = screen(f, to_f(core) * 0.9)
    # faint baseline rule
    rule = Image.new("RGB", size, (0, 0, 0))
    ImageDraw.Draw(rule).line([(0, baseline), (w, baseline)], fill=tuple(int(v*0.18) for v in GOLD), width=1)
    f = screen(f, to_f(rule))
    return finish(f, size, vig=0.62, cy=0.55)


def scene_constellation(size, seed=23):
    rng = random.Random(seed)
    w, h = size
    base = base_canvas(size, seed)
    n = 46
    nodes = []
    for _ in range(n):
        x = rng.uniform(0.04, 0.96) * w
        y = rng.uniform(0.10, 0.92) * h
        nodes.append((x, y))
    # connect near neighbors
    edges = []
    for i, a in enumerate(nodes):
        dists = sorted(range(len(nodes)), key=lambda j: (nodes[j][0]-a[0])**2 + (nodes[j][1]-a[1])**2)
        for j in dists[1:4]:
            if rng.random() < 0.7:
                edges.append((a, nodes[j]))

    def paint_lines(d):
        for a, b in edges:
            d.line([a, b], fill=120, width=2)

    def paint_nodes(d):
        for (x, y) in nodes:
            r = rng.uniform(3, 7)
            d.ellipse([x-r, y-r, x+r, y+r], fill=255)

    f = base
    f = screen(f, glow_layer(size, paint_lines, GOLD, blurs=(2, 8, 22),
                             weights=(0.8, 0.6, 0.4), gain=0.7))
    f = screen(f, glow_layer(size, paint_nodes, GOLD_LT, blurs=(2, 6, 18, 46),
                             weights=(1.0, 0.9, 0.7, 0.5), gain=1.2))
    # crisp thin edges + node cores
    crisp = Image.new("RGB", size, (0, 0, 0))
    cd = ImageDraw.Draw(crisp)
    for a, b in edges:
        cd.line([a, b], fill=tuple(int(v*0.22) for v in GOLD), width=1)
    for (x, y) in nodes:
        cd.ellipse([x-2, y-2, x+2, y+2], fill=GOLD_LT)
    f = screen(f, to_f(crisp))
    return finish(f, size, vig=0.6, cx=0.55, cy=0.42)


def scene_aurora(size, seed=31):
    rng = random.Random(seed)
    w, h = size
    base = base_canvas(size, seed)
    f = base
    # flowing ribbons
    for k in range(4):
        cy = h * rng.uniform(0.3, 0.75)
        amp = h * rng.uniform(0.04, 0.10)
        freq = rng.uniform(0.6, 1.4)
        phase = rng.uniform(0, 6)
        thick = rng.uniform(8, 22)
        pts = []
        for xi in range(0, w + 1, 8):
            t = xi / w
            y = cy + math.sin(t * math.pi * 2 * freq + phase) * amp + math.sin(t*10+phase)*amp*0.15
            pts.append((xi, y))

        def paint(d, pts=pts, thick=thick):
            d.line(pts, fill=255, width=int(thick), joint="curve")

        col = GOLD if k % 2 else GOLD_LT
        f = screen(f, glow_layer(size, paint, col, blurs=(10, 28, 70),
                                 weights=(0.7, 0.6, 0.5), gain=0.55))
    # bokeh particles
    part = Image.new("L", size, 0)
    pd = ImageDraw.Draw(part)
    for _ in range(90):
        x = rng.uniform(0, w); y = rng.uniform(0, h)
        r = rng.uniform(1.5, 9)
        pd.ellipse([x-r, y-r, x+r, y+r], fill=int(rng.uniform(40, 255)))
    pglow = np.asarray(part.filter(ImageFilter.GaussianBlur(3)), np.float32)/255.0
    col = np.array(GOLD_LT, np.float32)/255.0
    f = screen(f, pglow[:, :, None] * col[None, None, :] * 0.8)
    return finish(f, size, vig=0.62, cx=0.5, cy=0.45)


def scene_concentric(size, seed=41):
    w, h = size
    base = base_canvas(size, seed)
    cx, cy = w * 0.5, h * 1.02
    rings = 22

    def paint(d):
        for i in range(rings):
            r = (i + 1) * (h * 0.085)
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=int(200 - i * 6), width=2)

    f = screen(base, glow_layer(size, paint, GOLD, blurs=(2, 8, 24),
                                weights=(0.7, 0.55, 0.4), gain=0.6))
    crisp = Image.new("RGB", size, (0, 0, 0))
    cd = ImageDraw.Draw(crisp)
    for i in range(rings):
        r = (i + 1) * (h * 0.085)
        cd.ellipse([cx - r, cy - r, cx + r, cy + r], outline=tuple(int(v*0.16) for v in GOLD), width=1)
    f = screen(f, to_f(crisp))
    return finish(f, size, vig=0.66, cx=0.5, cy=0.5)


def scene_mesh(size, seed=51):
    w, h = size
    base = base_canvas(size, seed)
    horizon = h * 0.46
    vp_x = w * 0.5

    def paint(d):
        # horizontal lines, compressed toward horizon
        for i in range(1, 26):
            t = i / 26
            y = horizon + (h - horizon) * (t ** 2.2)
            d.line([(0, y), (w, y)], fill=int(150 * (0.3 + 0.7 * t)), width=2)
        # converging verticals
        for gx in range(-12, 13):
            x_bottom = vp_x + gx * (w / 12)
            d.line([(vp_x + gx * 18, horizon), (x_bottom, h)], fill=90, width=2)

    f = screen(base, glow_layer(size, paint, GOLD, blurs=(2, 10, 30),
                                weights=(0.5, 0.45, 0.35), gain=0.5))
    crisp = Image.new("RGB", size, (0, 0, 0))
    cd = ImageDraw.Draw(crisp)
    for i in range(1, 26):
        t = i / 26
        y = horizon + (h - horizon) * (t ** 2.2)
        cd.line([(0, y), (w, y)], fill=tuple(int(v*0.12*(0.3+0.7*t)) for v in GOLD), width=1)
    for gx in range(-12, 13):
        x_bottom = vp_x + gx * (w / 12)
        cd.line([(vp_x + gx * 18, horizon), (x_bottom, h)], fill=tuple(int(v*0.10) for v in GOLD), width=1)
    f = screen(f, to_f(crisp))
    # soft horizon glow
    hg = Image.new("L", size, 0)
    ImageDraw.Draw(hg).line([(0, horizon), (w, horizon)], fill=255, width=3)
    hgf = np.asarray(hg.filter(ImageFilter.GaussianBlur(40)), np.float32)/255.0
    f = screen(f, hgf[:, :, None] * (np.array(GOLD_LT, np.float32)/255.0)[None, None, :] * 0.5)
    return finish(f, size, vig=0.6, cx=0.5, cy=0.4)


def scene_void(size, seed=61):
    w, h = size
    base = base_canvas(size, seed)
    g = Image.new("L", size, 0)
    ImageDraw.Draw(g).ellipse([w*0.2, h*0.1, w*0.8, h*0.9], fill=255)
    gf = np.asarray(g.filter(ImageFilter.GaussianBlur(160)), np.float32)/255.0
    f = screen(base, gf[:, :, None] * (np.array(GOLD, np.float32)/255.0)[None, None, :] * 0.28)
    return finish(f, size, vig=0.7, cx=0.5, cy=0.4)


SCENES = {
    "hero-pulse": scene_pulse,
    "hero-constellation": scene_constellation,
    "hero-aurora": scene_aurora,
    "section-rings": scene_concentric,
    "section-mesh": scene_mesh,
    "section-void": scene_void,
}


def main():
    import os
    out = os.path.join(os.path.dirname(__file__), "..", "public", "images", "bg")
    out = os.path.abspath(out)
    os.makedirs(out, exist_ok=True)
    thumbs = []
    for name, fn in SCENES.items():
        print("rendering", name)
        img = fn((W, H))
        path = os.path.join(out, name + ".webp")
        img.save(path, "WEBP", quality=84, method=6)
        print("  ->", path, f"{os.path.getsize(path)//1024} KB")
        thumbs.append(img.resize((W // 4, H // 4)))
    # contact sheet
    cols = 2
    rows = (len(thumbs) + 1) // 2
    tw, th = thumbs[0].size
    sheet = Image.new("RGB", (tw * cols + 30, th * rows + 30), (10, 14, 20))
    for i, t in enumerate(thumbs):
        r, c = divmod(i, cols)
        sheet.paste(t, (10 + c * (tw + 10), 10 + r * (th + 10)))
    sheet.save(os.path.join(out, "_montage.webp"), "WEBP", quality=80)
    print("montage saved")


if __name__ == "__main__":
    main()
