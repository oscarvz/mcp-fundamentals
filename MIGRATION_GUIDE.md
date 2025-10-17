# Migration from stdio to HTTP-only (mcp-lite)

## Overview

This document outlines the migration from `@modelcontextprotocol/sdk` with stdio
transport to pure `mcp-lite` with HTTP transport only.

## What We've Changed So Far

### 1. ✅ Created Shared Test Utilities

**File:** `exercises/shared/test-utils.ts`

- In-process HTTP testing - no stdio, no process spawning
- Direct invocation of handler functions
- Full MCP protocol support (ping, tools, resources, prompts)
- Auto-cleanup with Symbol.asyncDispose

### 2. ✅ Created Shared Package

**File:** `exercises/shared/package.json`

- Workspace package for shared utilities
- Added to root workspace configuration

### 3. ✅ Updated 01.ping Solution

**File:** `exercises/01.ping/01.solution.connect/src/index.ts`

- **Removed:** StdioTransport adapter class
- **Uses:** Pure mcp-lite (McpServer + StreamableHttpTransport)
- **Exports:** `server` and `handler` for testing
- **Includes:** Optional main() function for standalone HTTP server
- **No stdio:** Completely removed readline and stdio code

### 4. ✅ Updated 01.ping Solution Tests

**File:** `exercises/01.ping/01.solution.connect/src/index.test.ts`

- **Removed:** StdioClientTransport
- **Uses:** In-process testing via shared test utilities
- **Much simpler:** From 67 lines to 12 lines

### 5. ✅ Updated 01.ping Solution Dependencies

**File:** `exercises/01.ping/01.solution.connect/package.json`

- **Removed:** `@modelcontextprotocol/sdk`
- **Added:** `mcp-lite`, `zod-to-json-schema`

## Architecture Benefits

### Old (stdio-based):

```
Test → StdioClientTransport → spawn tsx → StdioServerTransport → McpServer
```

### New (HTTP-based):

```
Test → Import handler → McpServer (no processes!)
```

### Key Improvements:

1. **No process spawning** - Tests run in-process
2. **Faster tests** - No IPC overhead
3. **Better debugging** - Single process, simpler stack traces
4. **Platform agnostic** - Works in Node, Deno, Bun, browsers, serverless
5. **mcp-lite native** - Uses the library as intended
6. **Simpler code** - No stdio adapters needed

## Remaining Work

### Phase 1: Complete 01.ping Exercise

- [ ] Install dependencies: `npm install` from root
- [ ] Verify tests pass
- [ ] Update problem files (`01.problem.connect`)

### Phase 2: Update 02.tools (4 exercises)

Files to update per exercise:

- `package.json` - Replace deps
- `src/index.ts` - Use mcp-lite HTTP
- `src/index.test.ts` - Use shared test utils

### Phase 3: Update 03.resources (4 exercises)

Same pattern as Phase 2

### Phase 4: Update 04.resource-tools (2 exercises)

Same pattern as Phase 2

### Phase 5: Update 05.prompts (3 exercises)

Same pattern as Phase 2

### Phase 6: Documentation

- [ ] Update README files
- [ ] Update exercise instructions
- [ ] Add HTTP transport examples

## Migration Template

For each exercise, follow this pattern:

### 1. Update package.json

```json
{
	"dependencies": {
		"@epic-web/invariant": "^1.0.0",
		"mcp-lite": "^0.8.2",
		"zod": "^3.25.67",
		"zod-to-json-schema": "^3.24.1"
	}
}
```

### 2. Update src/index.ts

```typescript
import { createServer } from 'node:http'
import { McpServer, StreamableHttpTransport } from 'mcp-lite'
import type { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

// Create MCP server
export const server = new McpServer({
  name: 'server-name',
  version: '1.0.0',
  schemaAdapter: (schema) => zodToJsonSchema(schema as z.ZodType),
})

// Register tools, resources, prompts...
// server.tool('name', { ... })

// Create transport
const transport = new StreamableHttpTransport()
export const handler = transport.bind(server)

// Optional: HTTP server for standalone use
async function main() {
  // ... create Node.js HTTP server using handler
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(...)
}
```

### 3. Update src/index.test.ts

```typescript
import { test, expect } from 'vitest'
import { setupTestClient } from '@exercises/shared/test-utils'
import { server, handler } from './index.js'

test('Test Name', async () => {
	await using setup = await setupTestClient(server, handler)
	const { client } = setup

	// Use client methods: ping(), listTools(), callTool(), etc.
	const result = await client.ping()
	expect(result).toEqual({})
})
```

## Testing the Migration

After migrating each exercise:

```bash
# Install dependencies
npm install

# Run tests for specific exercise
cd exercises/XX.name/YY.problem/
npm test

# Run all tests
npm test
```

## Notes

- The `@exercises/shared` package provides all testing utilities
- No need for stdio transports or process spawning
- Tests are faster and easier to debug
- Same code works in different JS runtimes
- The HTTP server in main() is optional - primarily for manual testing
