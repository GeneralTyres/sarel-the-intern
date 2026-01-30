# Sarel the Intern

AI-powered development agents for automating code improvements and repetitive tasks.

## What is This?

Sarel the Intern is a collection of AI agents that help with common development tasks. Each agent is specialized for a specific job and can be run independently or integrated into larger workflows.

## Setup

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd sarel-the-intern
   npm install
   ```

2. **Configure LLM**
   
   Copy `.env.example` to `.env` and configure your LLM settings:
   ```bash
   cp .env.example .env
   ```
   
   For local Ollama (default):
   ```env
   LLM_BASE_URL=http://localhost:11434/v1
   LLM_MODEL=qwen2.5-coder:7b
   LLM_API_KEY=ollama
   ```
   
   For OpenAI:
   ```env
   LLM_BASE_URL=https://api.openai.com/v1
   LLM_MODEL=gpt-4
   LLM_API_KEY=sk-your-key-here
   ```

## Available Agents

### Improve Documentation

Analyzes your code and improves comments and documentation throughout your project.

**What it does:**
- Adds or improves inline comments for complex logic
- Adds JSDoc/TSDoc comments for functions and classes
- Preserves all working code and formatting

**How to run:**
```bash
# Process entire project
npm run improve-docs

# Process specific directory
npm run improve-docs ./src/components

# Or use tsx directly
npx tsx src/agents/improve-docs.ts ./path/to/code
```

**What gets processed:**
- TypeScript files (.ts, .tsx)
- JavaScript files (.js, .jsx)
- Automatically skips node_modules, dist, and other build artifacts

**Note:** Review changes with your IDE's diff viewer before committing. Use Git to revert if needed.

## Future Agents

More agents coming soon:
- Code refactoring
- Test generation
- Security scanning
- Performance analysis

## Tips

- Always review AI-generated changes before committing
- Use Git to track changes and revert if needed
- Start with a small directory to test configuration
- Adjust LLM temperature in code if outputs are too conservative or creative

## Architecture

Each agent is both a standalone CLI script and an importable function, making it easy to compose workflows or integrate into other tools.
