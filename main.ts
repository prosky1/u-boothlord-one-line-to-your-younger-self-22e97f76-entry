import { mkdir, writeFile } from "node:fs/promises";

const MESSAGE = "She will marry the man who sent the text you keep rewriting.";
const OUT_PATH = "/output/entry.txt";
const OUT_DIR = "/output";

function measureUtf8(text: string): number {
  return new TextEncoder().encode(text).byteLength;
}

function countSentenceEnds(text: string): number {
  let hits = 0;
  for (const ch of text) {
    if (ch === "." || ch === "!" || ch === "?") hits += 1;
  }
  return hits;
}

function assertGate(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("whitespace-only payload rejected");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("payload must be a single line");
  }
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    throw new Error("payload length out of gate range");
  }
  if (countSentenceEnds(text) !== 1) {
    throw new Error("payload must hold exactly one sentence");
  }
  const tail = text[text.length - 1];
  if (tail !== "." && tail !== "!" && tail !== "?") {
    throw new Error("payload must end with sentence punctuation");
  }
}

async function emitLine(line: string): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_PATH, line, "utf8");
}

async function main(): Promise<void> {
  const payload = MESSAGE;
  assertGate(payload);
  const size = measureUtf8(payload);
  if (size === 0) {
    throw new Error("empty payload");
  }
  await emitLine(payload);
}

await main();
