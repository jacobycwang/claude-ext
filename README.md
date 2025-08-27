# claude-ext

CLI tool to manage Claude MCP (Model Context Protocol) servers. Easily toggle MCP servers between active and disabled states with an interactive checkbox interface.

## Installation

```bash
npm install -g claude-ext
```

## Usage

Run the interactive MCP server manager:

```bash
claude-ext mcp
```

This will show you a checkbox interface where you can:
- See all your MCP servers and their current status
- Toggle servers on/off with the spacebar
- Press `a` to toggle all servers
- Press `i` to invert selection
- Press Enter to apply changes

## How it works

- **Active servers** (checked ✓) are stored in `~/.claude.json` and available in Claude
- **Disabled servers** (unchecked ✗) are moved to `~/.claude-ext.json` and not loaded by Claude
- All server configurations are preserved when toggling between states

## Requirements

- Node.js 16+ 
- Existing `~/.claude.json` file with MCP servers configured

## Example

```
❯ claude-ext mcp
MCP Server Manager
Select which MCP servers should be active in Claude:

? Toggle MCP servers (active servers will be in ~/.claude.json):
❯◉ ✓ google_maps_mcp_server (active)
 ◉ ✓ playwright (active)  
 ◯ ✗ postgres-beta (disabled)
 ◉ ✓ slack-user-mcp (active)
```

## License

MIT