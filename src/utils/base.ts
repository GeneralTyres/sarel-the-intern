import { parse } from 'acorn';

export function isValidJS(code) {
    try { parse(code, { ecmaVersion: 'latest', sourceType: 'module' }); return true; }
    catch { return false; }
}

export function stripCodeFences(text) {
    if (!text) return text;
    // trim outer whitespace/newlines first
    const t = text.trim();

    // single fenced block with optional language hint
    const singleFence = t.match(/^```(?:[\w-+]+)?\n([\s\S]*?)\n?```$/);
    if (singleFence) return singleFence[1];

    // multiple fenced blocks: return concatenation of inner contents
    const allFences = [...t.matchAll(/```(?:[\w-+]+)?\n([\s\S]*?)\n?```/g)];
    if (allFences.length) return allFences.map(m => m[1]).join('\n');

    // no fences found — return trimmed original to remove accidental leading/trailing blank lines
    return t;
}
