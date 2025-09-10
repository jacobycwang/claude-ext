import { existsSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import type { ClaudeConfig } from "./types.js";

const CLAUDE_CONFIG_PATH = join(homedir(), ".claude.json");
const CLAUDE_EXT_CONFIG_PATH = join(homedir(), ".claude-ext.json");
const PROJECT_MCP_CONFIG_PATH = ".mcp.json";

export function readClaudeConfig(): ClaudeConfig {
	try {
		if (!existsSync(CLAUDE_CONFIG_PATH)) {
			return {};
		}
		const content = readFileSync(CLAUDE_CONFIG_PATH, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error("Failed to read ~/.claude.json:", error);
		return {};
	}
}

export function readClaudeExtConfig(): ClaudeConfig {
	try {
		if (!existsSync(CLAUDE_EXT_CONFIG_PATH)) {
			return {};
		}
		const content = readFileSync(CLAUDE_EXT_CONFIG_PATH, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error("Failed to read ~/.claude-ext.json:", error);
		return {};
	}
}

export function writeClaudeConfig(config: ClaudeConfig): void {
	try {
		writeFileSync(CLAUDE_CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (error) {
		console.error("Failed to write ~/.claude.json:", error);
		throw error;
	}
}

export function writeClaudeExtConfig(config: ClaudeConfig): void {
	try {
		writeFileSync(CLAUDE_EXT_CONFIG_PATH, JSON.stringify(config, null, 2));
	} catch (error) {
		console.error("Failed to write ~/.claude-ext.json:", error);
		throw error;
	}
}

export function readProjectMcpConfig(): ClaudeConfig {
	try {
		if (!existsSync(PROJECT_MCP_CONFIG_PATH)) {
			return {};
		}
		const content = readFileSync(PROJECT_MCP_CONFIG_PATH, "utf-8");
		return JSON.parse(content);
	} catch (error) {
		console.error("Failed to read .mcp.json:", error);
		return {};
	}
}

export function getAllMcpServers(): {
	active: Record<string, any>;
	disabled: Record<string, any>;
	project: Record<string, any>;
} {
	const claudeConfig = readClaudeConfig();
	const claudeExtConfig = readClaudeExtConfig();
	const projectConfig = readProjectMcpConfig();

	return {
		active: claudeConfig.mcpServers || {},
		disabled: claudeExtConfig.mcpServers || {},
		project: projectConfig.mcpServers || {},
	};
}
