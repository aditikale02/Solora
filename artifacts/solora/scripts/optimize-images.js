import fs from "fs/promises";
import path from "path";

let sharp;
try {
  // try dynamic import so script can gracefully skip if sharp isn't installed
  // eslint-disable-next-line no-eval
  sharp = (await import('sharp')).default;
} catch (err) {
  console.warn('sharp not installed — skipping image optimization. Run `pnpm --filter ./artifacts/solora add -D sharp` to enable.');
  sharp = null;
}

const imagesDir = path.resolve(process.cwd(), "src/assets/images");

async function findImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findImages(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function optimize() {
  try {
    if (!sharp) return;
    const imgs = await findImages(imagesDir);
    console.log(`Found ${imgs.length} images to optimize`);
    for (const img of imgs) {
      const ext = path.extname(img).toLowerCase();
      const tmp = img + ".opt";
      try {
        if (ext === ".png") {
          await sharp(img).png({ quality: 80, compressionLevel: 9 }).toFile(tmp);
        } else {
          await sharp(img).jpeg({ quality: 72, mozjpeg: true }).toFile(tmp);
        }
        await fs.rename(tmp, img);
        console.log(`Optimized ${path.relative(process.cwd(), img)}`);
      } catch (err) {
        console.warn(`Failed to optimize ${img}: ${String(err)}`);
        try { await fs.unlink(tmp).catch(() => {}); } catch {}
      }
    }
  } catch (err) {
    console.error("Image optimization failed:", err);
    // don't fail the build if image optimization errors out
  }
}

optimize();
