#!/usr/bin/env node
/**
 * Turns a video into the scroll-scrubbed hero image sequence.
 *
 *   npm run frames -- path/to/stadium-flythrough.mp4 [--frames 180] [--width 1920] [--quality 72]
 *
 * Writes public/frames/frame_0001.webp … plus public/frames/manifest.json. The homepage hero
 * detects the manifest and switches from the live 3D fly-through to the image sequence — no code
 * change needed. Delete public/frames to switch back. Requires ffmpeg on PATH.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--'));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : fallback;
};

if (!input || !existsSync(input)) {
  console.error('Usage: npm run frames -- <video file> [--frames 180] [--width 1920] [--quality 72]');
  process.exit(1);
}

const frames = opt('frames', 180);
const width = opt('width', 1920);
const quality = opt('quality', 72);
const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/frames');

const duration = Number(
  execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', input]).toString().trim(),
);
if (!duration) throw new Error('Could not read video duration.');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const fps = frames / duration;
console.log(`Extracting ${frames} frames from ${duration.toFixed(2)}s video at ${fps.toFixed(2)} fps…`);
execFileSync(
  'ffmpeg',
  ['-loglevel', 'error', '-i', input, '-vf', `fps=${fps},scale=${width}:-2`, '-c:v', 'libwebp', '-quality', String(quality), '-frames:v', String(frames), join(outDir, 'frame_%04d.webp')],
  { stdio: 'inherit' },
);

const count = readdirSync(outDir).filter((f) => f.endsWith('.webp')).length;
const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', join(outDir, 'frame_0001.webp')])
  .toString()
  .trim()
  .split(',')
  .map(Number);

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ count, pattern: 'frame_{i}.webp', pad: 4, width: w, height: h }, null, 2));
console.log(`Done: ${count} frames (${w}×${h}) in public/frames. Reload the homepage to see the new hero.`);
