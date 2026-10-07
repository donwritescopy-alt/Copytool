# Audit prompts

These files are the writing instructions the web app gives Gemini for every audit.

## Files

- `system.md` is the main audit prompt. It applies to every audit. It is adapted from your original system prompt (see "What changed" below).
- `personas/` holds one full prompt for each writer: Zara, Dot, Sam, Marcus, Bex, Leo and Val. Each file keeps the character as you wrote it and ends with an "In an audit" section that explains how that writer behaves when rewriting existing copy.

## How they combine

For each audit the web app builds one set of instructions in this order:

1. `system.md` (the craft knowledge and the audit job)
2. The chosen writer's file from `personas/`
3. The project's brand guidelines (added automatically from the web app)
4. The frame context: channel, primary goal, constraints (added automatically)
5. The audit safety rules the web app already has

Brand details and the user's constraints always win over a writer's style.

## What changed from the original system prompt

- "Deliver 3 headline options" became one best rewrite per text layer, because the plugin applies one rewrite per layer.
- The labeled output formats and the "state your strategy" step were folded into the audit summary, because the web app returns a fixed structure (summary, findings, suggestions).
- "Research instinct" became "use what you are given". Gemini is told never to invent facts, numbers or quotes.
- A rule was added to leave layers alone when they already work.

## Val is a draft

Val's original entry had only a short description and five example lines. Her full character (who she is, beliefs, how she sounds, lines she would never write, the imposter) was drafted from those notes. Read `personas/val.md` and edit anything that does not sound like her.

## Editing later

To change how one writer sounds, edit only that writer's file. To change the rules for every audit, edit `system.md`.
