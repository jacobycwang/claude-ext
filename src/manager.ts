import chalk from "chalk";
import {
	getAllMcpServers,
	readClaudeConfig,
	readClaudeExtConfig,
	writeClaudeConfig,
	writeClaudeExtConfig,
} from "./config.js";

export function toggleMcpServers(selectedServers: string[]): void {
	const { active, disabled, project } = getAllMcpServers();
	const claudeConfig = readClaudeConfig();
	const claudeExtConfig = readClaudeExtConfig();

	// Initialize mcpServers if they don't exist
	if (!claudeConfig.mcpServers) {
		claudeConfig.mcpServers = {};
	}
	if (!claudeExtConfig.mcpServers) {
		claudeExtConfig.mcpServers = {};
	}

	const allServers = { ...active, ...disabled };
	
	// Separate project servers from regular servers
	const projectServerSelection = selectedServers.filter(name => name.startsWith("project:"));
	const regularServerSelection = selectedServers.filter(name => !name.startsWith("project:"));

	// Clear both configs' mcpServers
	claudeConfig.mcpServers = {};
	claudeExtConfig.mcpServers = {};

	// Handle regular servers (global/disabled servers)
	for (const [serverName, serverConfig] of Object.entries(allServers)) {
		if (regularServerSelection.includes(serverName)) {
			// Server should be active - move to ~/.claude.json
			claudeConfig.mcpServers[serverName] = serverConfig;
			console.log(chalk.green(`✓ Enabled: ${serverName}`));
		} else {
			// Server should be disabled - move to ~/.claude-ext.json
			claudeExtConfig.mcpServers[serverName] = serverConfig;
			console.log(chalk.red(`✗ Disabled: ${serverName}`));
		}
	}

	// Handle project servers (copy to global config when selected)
	for (const [serverName, serverConfig] of Object.entries(project)) {
		const projectServerKey = `project:${serverName}`;
		if (projectServerSelection.includes(projectServerKey)) {
			// Project server should be active - copy to ~/.claude.json
			claudeConfig.mcpServers[serverName] = serverConfig;
			console.log(chalk.green(`✓ Enabled: ${serverName} ${chalk.gray("(from project)")}`));
		} else {
			console.log(chalk.gray(`- Skipped: ${serverName} ${chalk.gray("(project server, not selected)")}`));
		}
	}

	// Write updated configs
	try {
		writeClaudeConfig(claudeConfig);
		writeClaudeExtConfig(claudeExtConfig);

		console.log();
		console.log(chalk.blue("Configuration updated successfully!"));
		console.log(
			chalk.gray(
				`Active servers: ${Object.keys(claudeConfig.mcpServers).length}`,
			),
		);
		console.log(
			chalk.gray(
				`Disabled servers: ${Object.keys(claudeExtConfig.mcpServers).length}`,
			),
		);
	} catch (error) {
		console.error(chalk.red("Failed to save configuration:"), error);
		process.exit(1);
	}
}
