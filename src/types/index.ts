export interface LLMConfig {
  baseURL: string;
  model: string;
  apiKey: string;
}

export interface FileIndexOptions {
  rootPath: string;
  ignorePatterns?: string[];
  includePatterns?: string[];
}

export interface ImproveDocsOptions {
  targetPath?: string;
  includePatterns?: string[];
  excludePatterns?: string[];
}
