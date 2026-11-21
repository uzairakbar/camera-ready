#!/usr/bin/env node
/*
 * Camera Ready: render maths at build time.
 *
 *     zola build
 *     node themes/camera-ready/scripts/prerender-math.js public
 *
 * Replaces every $`...`$ and $$`...`$$ in the built HTML with KaTeX output
 * and removes the browser fallback scripts, so visitors need no JavaScript.
 * It uses the copy of KaTeX that ships in the theme: nothing to install, any
 * Node.js version from 14 on will do.
 *
 * This step is optional. Skip it and the same maths is rendered in the
 * visitor's browser by the same copy of KaTeX.
 *
 * Exits with status 1 if any formula fails to parse, listing each one.
 * Pass --lenient to report them and carry on.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const lenient = args.includes('--lenient');
const dir = args.find((a) => !a.startsWith('--')) || 'public';

if (!fs.existsSync(dir)) {
  console.error(`prerender-math: no such directory: ${dir} (run "zola build" first)`);
  process.exit(1);
}

// Prefer the KaTeX that was copied into the built site, so the script and
// the stylesheet the pages link to are always the same version.
const candidates = [
  path.join(dir, 'katex', 'katex.min.js'),
  path.join(__dirname, '..', 'static', 'katex', 'katex.min.js'),
];
const katexPath = candidates.find((p) => fs.existsSync(p));
if (!katexPath) {
  console.error('prerender-math: could not find katex/katex.min.js');
  process.exit(1);
}
const katex = require(path.resolve(katexPath));

const MATH = /(\${1,2})<code>([\s\S]*?)<\/code>\1/g;
const FALLBACK = /^[ \t]*<script[^>]*\bdata-math-fallback\b[^>]*><\/script>[ \t]*\r?\n?/gm;

function decode(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}

function walk(d, out) {
  for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let formulas = 0;
let pages = 0;
const errors = [];

for (const file of walk(dir, [])) {
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('data-math-fallback')) continue;

  const rendered = html.replace(MATH, (match, dollars, source) => {
    const tex = decode(source);
    const displayMode = dollars.length === 2;
    formulas += 1;
    try {
      return katex.renderToString(tex, { displayMode, throwOnError: true });
    } catch (err) {
      errors.push(`${file}: ${tex.trim().slice(0, 60)}\n    ${err.message}`);
      return katex.renderToString(tex, { displayMode, throwOnError: false });
    }
  });

  fs.writeFileSync(file, rendered.replace(FALLBACK, ''));
  pages += 1;
}

console.log(`prerender-math: ${formulas} formulas on ${pages} pages`);
if (errors.length) {
  console.error(`prerender-math: ${errors.length} formula(s) failed to parse:`);
  for (const e of errors) console.error(`  ${e}`);
  if (!lenient) process.exit(1);
}
