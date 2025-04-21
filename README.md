# prayer_time MCP Server

An MCP server to get muslim prayer (aka Salah) times for given date and location

## Features

### Tools
- `get_daily_prayer_times` - Get daily prayer times for a specific location
 - Takes `latitude` (number), `longitude` (number), and `date` (string, YYYY-MM-DD) as required parameters
 - Returns the calculated prayer times for the given date and location

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "prayer_time": {
      "command": "/path/to/prayer_time/build/index.js"
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.
