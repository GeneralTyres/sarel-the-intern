import { resolve } from 'path';
import { indexProject, readFile, writeFile, getRelativePath } from '../utils/file-system.js';
import { callLLM } from '../utils/llm-client.js';
import type { ImproveDocsOptions } from '../types/index.js';
import {isValidJS, stripCodeFences} from "../utils/base";

const SYSTEM_PROMPT = `You are a documentation expert. Your task is to improve comments and documentation in code files.

Rules:
- Add or improve comments only where the code intent is unclear
- Add JSDoc or TSDoc comments for functions, classes, and non-trivial logic
- Do not change, refactor, rename, or reformat any existing code
- Do not add new functionality
- Preserve all formatting, ordering, imports, and exports

Output requirements:
- Return ONLY the complete file contents
- Do NOT include explanations, analysis, or summaries
- Do NOT wrap the output in markdown, code fences, or language identifiers
- The output must be valid source code and directly writable to disk

Behavior:
- If unsure about intent, do not add a comment rather than guessing
`;

export async function improveDocs(options: ImproveDocsOptions = {}): Promise<void> {
  const targetPath = options.targetPath || process.cwd();
  const absolutePath = resolve(targetPath);

  console.log(`\n📚 Improving documentation in: ${absolutePath}\n`);

  // Index files
  const files = await indexProject({
    rootPath: absolutePath,
    includePatterns: options.includePatterns || ['**/*.{ts,js,tsx,jsx}'],
    ignorePatterns: options.excludePatterns,
  });

  console.log(`Found ${files.length} files to process\n`);

  let processed = 0;
  let failed = 0;

  for (const filePath of files) {
    const relativePath = getRelativePath(process.cwd(), filePath);
    
    try {
      console.log(`Processing: ${relativePath}`);
      
      // Read file
      const content = await readFile(filePath);
      
      // Build prompt
      const prompt = `Improve the documentation and comments in this file:\n\n${content}`;
      
      // Call LLM
      const improvedContent = await callLLM(prompt, SYSTEM_PROMPT);

      // Strip any markdown/code fences the model snuck in
      const cleaned = stripCodeFences(improvedContent);
      
      // Write back
      if (!isValidJS(cleaned)) {
        console.warn(`Skipped overwrite — output invalid JS. Saved to ${relativePath}.llm-output`);
      } else {
        await writeFile(filePath, cleaned);
      }
      
      processed++;
      console.log(`✓ Updated: ${relativePath}\n`);
    } catch (error) {
      failed++;
      console.error(`✗ Failed: ${relativePath}`);
      console.error(`  Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    }
  }

  console.log(`\n✨ Complete! Processed: ${processed}, Failed: ${failed}`);
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetPath = process.argv[2];
  
  improveDocs({ targetPath })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
