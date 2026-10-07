/* eslint @typescript-eslint/no-require-imports: off */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
require.extensions[".ts"] = (module, filename) => {
  const source = fs.readFileSync(filename, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  module._compile(compiled, filename);
};

const { buildSystemPrompt } = require(path.join(root, "src/lib/audit/prompt.ts"));
const { AUDIT_SYSTEM_PROMPT } = require(path.join(root, "src/lib/audit/prompts/system.ts"));
const { WRITER_PERSONAS, WRITER_NAMES } = require(path.join(root, "src/lib/audit/writers.ts"));
const generatedWriters = require(path.join(root, "src/lib/audit/prompts/writers.ts"));
const personas = ["Zara", "Dot", "Sam", "Marcus", "Bex", "Leo", "Val"];

const sampleProject = {
  brand_name: "Acme Books",
  target_audience: "readers and writers",
  brand_voice_keywords: "dry, warm, plain",
  narrative_stance: "we",
  key_terminology: null,
  words_to_avoid: "unlock, journey",
};
const sampleInput = (writerPersona) => ({
  projectId: "sample-project",
  writerPersona,
  frameContext: {
    channel: "Mobile App",
    primaryGoal: "Help the user continue",
    constraints: "Keep functional copy clear",
  },
  flowDescription: "",
  selectedText: [{ nodeId: "sample-layer", layerName: "Button", text: "Continue" }],
});

function readMarkdown(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

assert.equal(AUDIT_SYSTEM_PROMPT, readMarkdown("audit-prompts/system.md"));
assert.deepEqual(WRITER_NAMES, personas);
assert.equal(Object.keys(WRITER_PERSONAS).length, personas.length);

for (const name of personas) {
  const key = `${name.toUpperCase()}_PROMPT`;
  const personaText = readMarkdown(`audit-prompts/personas/${name.toLowerCase()}.md`);
  assert.equal(generatedWriters[key], personaText, `${name} generated module differs from Markdown`);
  assert.equal(WRITER_PERSONAS[name], personaText, `${name} writer entry differs from Markdown`);

  const assembled = buildSystemPrompt(sampleProject, sampleInput(name));
  const brandBlock = [
    "## Brand guidelines",
    "- Brand name: Acme Books",
    "- Target audience: readers and writers",
    "- Voice / keywords: dry, warm, plain",
    '- Narrative stance: First person plural ("we")',
    "- Key terminology (use these terms): Not specified",
    "- Words to avoid (never use these): unlock, journey",
  ].join("\n");
  const rulesHeading = "## How to audit";
  const precedenceRule = "The brand guidelines, key terminology, words to avoid, narrative stance and the user's constraints always take priority over the writer's style. A writer's voice never overrides clarity on functional text.";

  assert.ok(assembled.includes(AUDIT_SYSTEM_PROMPT), `${name}: missing main prompt`);
  assert.ok(assembled.includes(personaText), `${name}: missing writer prompt`);
  assert.ok(assembled.includes(brandBlock), `${name}: missing sample brand block`);
  assert.ok(assembled.includes(rulesHeading), `${name}: missing audit rules`);
  assert.ok(assembled.includes(precedenceRule), `${name}: missing precedence rule`);
  assert.ok(
    assembled.indexOf(AUDIT_SYSTEM_PROMPT) < assembled.indexOf(personaText) &&
      assembled.indexOf(personaText) < assembled.indexOf(brandBlock) &&
      assembled.indexOf(brandBlock) < assembled.indexOf("## Frame context") &&
      assembled.indexOf("## Frame context") < assembled.indexOf(rulesHeading),
    `${name}: instruction blocks are out of order`,
  );
  console.log(`PASS ${name}: full prompt, brand block, rules, block order, and exact Markdown match`);
}
