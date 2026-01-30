import { readFile as fsReadFile, writeFile as fsWriteFile } from 'fs/promises';
import { resolve, relative } from 'path';
import fg from 'fast-glob';
import type { FileIndexOptions } from '../types/index.js';

const DEFAULT_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/out/**',
  '**/*.min.js',
  '**/*.map',
  '**/package-lock.json',
  '**/yarn.lock',
  '**/pnpm-lock.yaml',
];

export async function indexProject(options: FileIndexOptions): Promise<string[]> {
  const { rootPath, ignorePatterns = [], includePatterns = ['**/*'] } = options;

  const allIgnorePatterns = [...DEFAULT_IGNORE_PATTERNS, ...ignorePatterns];

  const files = await fg(includePatterns, {
    cwd: rootPath,
    ignore: allIgnorePatterns,
    onlyFiles: true,
    absolute: false,
  });

  return files.map(file => resolve(rootPath, file));
}

export async function readFile(path: string): Promise<string> {
  return fsReadFile(path, 'utf-8');
}

export async function writeFile(path: string, content: string): Promise<void> {
  await fsWriteFile(path, content, 'utf-8');
}

export function getRelativePath(from: string, to: string): string {
  return relative(from, to);
}
