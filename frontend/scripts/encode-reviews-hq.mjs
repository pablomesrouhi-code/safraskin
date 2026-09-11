import sharp from "sharp";
import fs from "fs";
import path from "path";

const assets = "C:/Users/hp/.cursor/projects/c-Users-hp-Sfraskin/assets";
const root = path.resolve("public");

const pairs = [
  ["clarelia", 5],
  ["femmelia", 5],
  ["capilys", 5],
  ["luminora", 5],
];

async function writePair(src, out1600Rel) {
  const out1600 = path.join(root, out1600Rel);
  const out800 = out1600.replace(/-1600\.webp$/, "-800.webp");
  fs.mkdirSync(path.dirname(out1600), { recursive: true });

  const buf1600 = await sharp(src)
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 90, effort: 6, smartSubsample: true })
    .toBuffer();
  fs.writeFileSync(out1600, buf1600);

  const buf800 = await sharp(src)
    .rotate()
    .resize(800, 800, { fit: "inside", withoutEnlargement: true, kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 86, effort: 6, smartSubsample: true })
    .toBuffer();
  fs.writeFileSync(out800, buf800);

  const m = await sharp(out1600).metadata();
  console.log("OK", out1600Rel, `${m.width}x${m.height}`, `${Math.round(buf1600.length / 1024)}KB`);
}

for (const [slug, count] of pairs) {
  for (let i = 1; i <= count; i++) {
    const src = path.join(assets, `review-${slug}-${i}.png`);
    if (!fs.existsSync(src)) {
      console.log("MISSING", src);
      continue;
    }
    await writePair(src, `products/${slug}/reviews/${i}-1600.webp`);
  }
}

// Home hero from Saudi master
const heroSrc = path.join(root, "home/hero-saudi.png");
if (fs.existsSync(heroSrc)) {
  await writePair(heroSrc, "home/hero-1600.webp");
}

// Product home tiles from PNG masters when available
for (const slug of ["clarelia", "femmelia", "capilys", "luminora"]) {
  const png = path.join(root, "products", `${slug}.png`);
  if (fs.existsSync(png)) {
    await writePair(png, `products/home/${slug}-1600.webp`);
  }
}

console.log("done");
