export interface McpServer {
	command: string;
	args?: string[];
	env?: Record<string, string>;
	[key: string]: any;
}

export interface ClaudeConfig {
	mcpServers?: Record<string, McpServer>;
	[key: string]: any;
}

export interface ServerToggleItem {
	name: string;
	value: string;
	checked: boolean;
}
