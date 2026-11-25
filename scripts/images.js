import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const srcDir = 'images-src';
const outDir = 'src/assets/images';

const groups = [
  { prefix: 'work-', widths: [400, 715], fallback: 'jpg' },
  { prefix: 'journal-', widths: [150, 300], fallback: 'jpg' },
  { prefix: 'client-', widths: 'retina', fallback: 'png' },
];

const encoders = {
  avif: (img) => img.avif({ quality: 55 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }),
  png: (img) => img.png({ compressionLevel: 9, palette: true }),
};

await mkdir(outDir, { recursive: true });

const files = (await readdir(srcDir)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file));

for (const file of files) {
  const group = groups.find((item) => file.startsWith(item.prefix));

  if (!group) {
    console.warn(`Пропущено ${file}: немає правила`);
    continue;
  }

  const input = path.join(srcDir, file);
  const name = path.parse(file).name;
  const { width } = await sharp(input).metadata();
  const half = Math.round(width / 2);
  const widths = group.widths === 'retina' ? [half, half * 2] : group.widths;

  for (const w of widths) {
    for (const format of ['avif', 'webp', group.fallback]) {
      const output = path.join(outDir, `${name}-${w}.${format}`);
      await encoders[format](sharp(input).resize({ width: w })).toFile(output);
    }
  }

  console.log(`${file}: ${widths.join(', ')}`);
}
