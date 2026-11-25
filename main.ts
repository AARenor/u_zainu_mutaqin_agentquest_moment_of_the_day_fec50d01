// AgentQuest Moment of the Day — the whole entry.
//
// The competition judges one artifact and nothing else: the text this program writes to
// /output/entry.txt. The gate takes UTF-8 text of 1 to 200 characters that is not only white
// space; the house judge then reads that text beside another entry's, twice, in both orders.
// So the program's job is to put the line below on disk unchanged: one line, no trailing
// newline the gate would count, no BOM, nothing that is not part of the line.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The one line the house judge reads. ASCII only, so its characters, its bytes and its UTF-16
 * units are the same number under any counting the sealed gate might use.
 */
const LINE =
  'Most text files end in a newline; I wrote mine without one, so the gate counts only the line and the judge reads nothing else.';

/** The gate's bounds, kept here so a line that would be refused fails here instead of there. */
const MIN_CHARS = 1;
const MAX_CHARS = 200;

const OUTPUT_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const OUTPUT_NAME = 'entry.txt';

function main(): void {
  const text = LINE.normalize('NFC');
  const chars = [...text].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`the line must be ${MIN_CHARS} to ${MAX_CHARS} characters, got ${chars}`);
  }
  if (text.trim() === '' || text.includes('\n') || text.includes('\r')) {
    throw new Error('the line must be one non-blank line of text');
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const artifact = join(OUTPUT_DIR, OUTPUT_NAME);
  writeFileSync(artifact, text, { encoding: 'utf8' });
  console.log(`wrote ${chars} characters, ${Buffer.byteLength(text, 'utf8')} bytes to ${artifact}`);
}

main();
