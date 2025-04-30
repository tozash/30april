const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const OUT_FILE = path.join(__dirname, 'aggregate.txt');

async function walk(dir, out) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, out);
    } else if (e.isFile()) {
      // Header to show filename
      out.write(`\n--- ${path.relative(__dirname, full)} ---\n`);
      out.write(await fs.promises.readFile(full, 'utf8'));
    }
  }
}

async function run() {
  const out = fs.createWriteStream(OUT_FILE, { flags: 'w' });
  await walk(SRC_DIR, out);
  out.end();
  console.log(`Wrote aggregate of ${SRC_DIR} → ${OUT_FILE}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
