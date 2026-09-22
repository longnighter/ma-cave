#!/usr/bin/env node
/**
 * Ad-hoc wine importer (not used by the app).
 *
 * For each wine name: call the geminiGetWineInfo edge function, then insert into Supabase.
 *
 * Usage:
 *   node scripts/import-wines.js --csv path/to/wines.csv
 *   node scripts/import-wines.js --names "Château Margaux 2015, Domaine Tempier Bandol 2018"
 *   node scripts/import-wines.js --csv wines.csv --column name --dry-run
 *   node scripts/import-wines.js --csv wines.csv --limit 3 --delay 1500
 *
 * CSV: one name per line, or a header row with a name column (default: first column, or "name").
 * Env: reads EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY from .env
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ROOT = path.resolve(__dirname, '..');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function parseArgs(argv) {
  const opts = {
    csv: null,
    names: null,
    column: null,
    dryRun: false,
    limit: null,
    delay: 1200,
    skipExisting: true,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--csv') opts.csv = argv[++i];
    else if (a === '--names') opts.names = argv[++i];
    else if (a === '--column') opts.column = argv[++i];
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--limit') opts.limit = Number(argv[++i]);
    else if (a === '--delay') opts.delay = Number(argv[++i]);
    else if (a === '--no-skip-existing') opts.skipExisting = false;
    else if (a === '--help' || a === '-h') opts.help = true;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return opts;
}

function usage() {
  console.log(`Usage:
  node scripts/import-wines.js --csv wines.csv [--column name]
  node scripts/import-wines.js --names "Wine A 2015, Wine B 2018"
  node scripts/import-wines.js --csv wines.csv --dry-run --limit 2

Options:
  --delay <ms>         Pause between wines (default 1200)
  --limit <n>          Only process first n names
  --no-skip-existing   Do not skip names already in DB (match on name+year after Gemini)
  --dry-run            Call Gemini and print payload, do not insert`);
}

/** Minimal CSV: split on commas outside quotes. */
function parseCsvLine(line) {
  const cells = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      cells.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  cells.push(cur.trim());
  return cells;
}

function namesFromCsv(filePath, column) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];

  const first = parseCsvLine(lines[0]);
  const looksLikeHeader = first.some((c) =>
    /^(name|nom|vin|wine|label)$/i.test(c)
  );

  let colIndex = 0;
  let start = 0;
  if (looksLikeHeader) {
    start = 1;
    if (column) {
      const idx = first.findIndex((c) => c.toLowerCase() === column.toLowerCase());
      if (idx === -1) {
        throw new Error(
          `Column "${column}" not found. Headers: ${first.join(', ')}`
        );
      }
      colIndex = idx;
    } else {
      const nameIdx = first.findIndex((c) =>
        /^(name|nom|vin|wine|label)$/i.test(c)
      );
      colIndex = nameIdx === -1 ? 0 : nameIdx;
    }
  } else if (column) {
    throw new Error('--column requires a CSV header row');
  }

  const names = [];
  for (let i = start; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    const name = (cells[colIndex] || '').trim();
    if (name) names.push(name);
  }
  return names;
}

function namesFromString(raw) {
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  loadEnv(path.join(ROOT, '.env'));
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || (!opts.csv && !opts.names)) {
    usage();
    process.exit(opts.help ? 0 : 1);
  }

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  }

  let names = opts.csv
    ? namesFromCsv(path.resolve(opts.csv), opts.column)
    : namesFromString(opts.names);

  // de-dupe while preserving order
  names = [...new Set(names)];
  if (opts.limit != null && !Number.isNaN(opts.limit)) {
    names = names.slice(0, opts.limit);
  }

  if (names.length === 0) {
    console.error('No wine names found.');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  console.log(
    `Importing ${names.length} wine(s)${opts.dryRun ? ' [dry-run]' : ''}…`
  );

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < names.length; i++) {
    const queryName = names[i];
    const label = `[${i + 1}/${names.length}] ${queryName}`;
    process.stdout.write(`${label} → Gemini… `);

    try {
      const { data: wineInfo, error: fnError } = await supabase.functions.invoke(
        'geminiGetWineInfo',
        { body: { name: queryName } }
      );

      if (fnError) throw fnError;
      if (!wineInfo || wineInfo.error) {
        throw new Error(wineInfo?.error || 'Empty response from geminiGetWineInfo');
      }

      console.log(
        `got "${wineInfo.name}" ${wineInfo.year || '?'} (${wineInfo.appellation || wineInfo.region || '—'})`
      );

      if (opts.skipExisting && wineInfo.name && wineInfo.year) {
        const { data: existing, error: findErr } = await supabase
          .from('wines')
          .select('id')
          .eq('name', wineInfo.name)
          .eq('year', wineInfo.year)
          .limit(1);
        if (findErr) throw findErr;
        if (existing?.length) {
          console.log(`  skip: already in DB (id=${existing[0].id})`);
          skipped++;
          if (i < names.length - 1) await sleep(opts.delay);
          continue;
        }
      }

      const row = {
        name: wineInfo.name,
        year: wineInfo.year,
        region: wineInfo.region,
        grape: wineInfo.grape,
        drink_from: wineInfo.bestToDrink?.[0],
        drink_to: wineInfo.bestToDrink?.[1],
        tasting_notes: wineInfo.tastingNotes,
        appellation: wineInfo.appellation,
        wine_pairing: wineInfo.winePairing,
        domain: wineInfo.domain,
      };

      if (opts.dryRun) {
        console.log('  dry-run payload:', JSON.stringify(row, null, 2));
        ok++;
      } else {
        const { data: inserted, error: insertErr } = await supabase
          .from('wines')
          .insert(row)
          .select('id')
          .single();
        if (insertErr) throw insertErr;
        console.log(`  inserted id=${inserted.id}`);
        ok++;
      }
    } catch (err) {
      failed++;
      console.error(`\n  FAIL: ${err.message || err}`);
    }

    if (i < names.length - 1) await sleep(opts.delay);
  }

  console.log(`\nDone. ok=${ok} skipped=${skipped} failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
