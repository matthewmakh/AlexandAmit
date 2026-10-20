"""Render the PNG assets Apple Wallet requires inside a .pkpass bundle.

Apple expects icon.png / icon@2x.png / icon@3x.png (29pt square) and
logo.png / logo@2x.png / logo@3x.png (up to 160x50pt) inside every pass.
The Lumen Robotics mark drawn here is the same geometry the React
<LumenMark /> component draws with SVG, so the on-screen pass and the
installable pass look identical.

Run:  python3 scripts/make-pass-assets.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "public" / "pass-assets" / "lumen"
OUT.mkdir(parents=True, exist_ok=True)

BRAND = (43, 92, 255)       # Lumen signal blue  #2B5CFF
BRAND_DEEP = (11, 42, 138)  # Lumen deep blue    #0B2A8A
WHITE = (255, 255, 255)

FONT_CANDIDATES = [
    "/usr/share/fonts/opentype/inter/Inter-SemiBold.otf",
    "/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def gradient_square(size: int) -> Image.Image:
    """Rounded square filled with a diagonal brand gradient."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    grad = Image.new("RGBA", (size, size))
    px = grad.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            r = round(BRAND[0] + (BRAND_DEEP[0] - BRAND[0]) * t)
            g = round(BRAND[1] + (BRAND_DEEP[1] - BRAND[1]) * t)
            b = round(BRAND[2] + (BRAND_DEEP[2] - BRAND[2]) * t)
            px[x, y] = (r, g, b, 255)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, size - 1, size - 1), radius=round(size * 0.24), fill=255
    )
    img.paste(grad, (0, 0), mask)
    return img


def draw_mark(img: Image.Image, cx: float, cy: float, r: float) -> None:
    """The Lumen mark: an open ring with a gap at the top-right and a dot
    sitting in the gap, like a point of light leaving an aperture."""
    d = ImageDraw.Draw(img)
    stroke = max(2, round(r * 0.26))
    bbox = (cx - r, cy - r, cx + r, cy + r)
    # Ring with a 70 degree gap centred on -45 degrees (top-right).
    d.arc(bbox, start=-10, end=280, fill=WHITE, width=stroke)
    # Dot in the gap.
    import math
    ang = math.radians(-45)
    dx, dy = cx + math.cos(ang) * r, cy + math.sin(ang) * r
    dr = stroke * 0.85
    d.ellipse((dx - dr, dy - dr, dx + dr, dy + dr), fill=WHITE)


def make_icon(size: int, name: str) -> None:
    # Supersample for clean edges.
    s = size * 4
    img = gradient_square(s)
    draw_mark(img, s / 2, s / 2, s * 0.30)
    img = img.resize((size, size), Image.LANCZOS)
    img.save(OUT / name, "PNG")


def make_logo(scale: int, name: str) -> None:
    # Apple's logo slot is up to 160x50pt. The image carries the mark alone;
    # pass.json's logoText carries "Lumen Robotics" beside it, which is how
    # Apple intends the two to combine.
    w, h = 50 * scale, 50 * scale
    s = 4
    W, H = w * s, h * s
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_mark(img, W / 2, H / 2, H * 0.34)
    img = img.resize((w, h), Image.LANCZOS)
    img.save(OUT / name, "PNG")


if __name__ == "__main__":
    make_icon(29, "icon.png")
    make_icon(58, "icon@2x.png")
    make_icon(87, "icon@3x.png")
    make_logo(1, "logo.png")
    make_logo(2, "logo@2x.png")
    make_logo(3, "logo@3x.png")
    print("wrote", sorted(p.name for p in OUT.iterdir()))
