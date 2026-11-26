// One Line to Your Younger Self — make.fun entry by @bosbuilds.
//
// The bounty asks for a single line, in English, that the entrant would
// send back to their younger self if one line were all they got: no
// explanation, no context, no second sentence. This program writes that
// line, and only that line, to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_TEXT =
  "Buy the domain, skip the meeting, and call Mom before the group chat does.";

const OUTPUT_DIR = "/output";
const OUTPUT_PATH = OUTPUT_DIR + "/entry.txt";

// The sealed scorer accepts only UTF-8 text of 1 to 200 characters that
// is not only whitespace, and the bounty brief demands a single line
// with no second sentence. Refuse to write anything that would fail:
// an invalid entry scores 0 and takes no prize.
function validateEntry(text: string): void {
  const problems: string[] = [];
  if (text.length < 1 || text.length > 200) {
    problems.push(`length ${text.length} is outside 1..200`);
  }
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    problems.push("entry spans more than one line");
  }
  const sentenceEnds = text.match(/[.!?]+/g) ?? [];
  if (sentenceEnds.length !== 1 || !/[.!?]$/.test(text)) {
    problems.push("entry is not exactly one sentence");
  }
  if (problems.length > 0) {
    throw new Error("invalid entry: " + problems.join("; "));
  }
}

validateEntry(ENTRY_TEXT);

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, ENTRY_TEXT, "utf8");

// Verify what actually landed on disk: the file must hold the line
// exactly — same characters, same order, no trailing newline, no BOM,
// nothing appended. The judge reads this file, so any drift here is
// the entry itself drifting.
const onDisk = readFileSync(OUTPUT_PATH, "utf8");
if (onDisk !== ENTRY_TEXT) {
  throw new Error(
    `entry.txt mismatch: wrote ${ENTRY_TEXT.length} chars, ` +
      `read back ${onDisk.length} chars`,
  );
}
const byteCount = Buffer.byteLength(onDisk, "utf8");
if (byteCount !== Buffer.byteLength(ENTRY_TEXT, "utf8")) {
  throw new Error("entry.txt byte length does not match the entry text");
}
