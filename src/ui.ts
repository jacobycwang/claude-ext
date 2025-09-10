import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { getAllMcpServers } from "./config.js";
import type { ServerToggleItem } from "./types.js";

export function createServerToggleItems(): ServerToggleItem[] {
	const { active, disabled, project } = getAllMcpServers();
	const items: ServerToggleItem[] = [];

	// Add active servers (checked by default)
	for (const [name] of Object.entries(active)) {
		items.push({
			name: `${chalk.green("✓")} ${name} ${chalk.gray("(active)")}`,
			value: name,
			checked: true,
		});
	}

	// Add disabled servers (unchecked by default)
	for (const [name] of Object.entries(disabled)) {
		items.push({
			name: `${chalk.red("✗")} ${name} ${chalk.gray("(disabled)")}`,
			value: name,
			checked: false,
		});
	}

	// Add project servers (toggleable)
	for (const [name] of Object.entries(project)) {
		// Check if this project server is also active in global config
		const isActiveGlobally = name in active;
		items.push({
			name: `${chalk.blue("📁")} ${name} ${chalk.gray("(project)")}${isActiveGlobally ? chalk.green(" ✓ active globally") : ""}`,
			value: `project:${name}`,
			checked: isActiveGlobally,
		});
	}

	return items.sort((a, b) => {
		// Sort project servers last
		if (a.value.startsWith("project:") && !b.value.startsWith("project:")) return 1;
		if (!a.value.startsWith("project:") && b.value.startsWith("project:")) return -1;
		return a.value.localeCompare(b.value);
	});
}

export async function showServerToggleUI(): Promise<string[]> {
	const items = createServerToggleItems();

	if (items.length === 0) {
		console.log(
			chalk.yellow(
				"No MCP servers found in ~/.claude.json, ~/.claude-ext.json, or .mcp.json",
			),
		);
		return [];
	}

	console.log(chalk.blue("MCP Server Manager"));
	console.log(
		chalk.gray("Select which MCP servers should be active in Claude:"),
	);
	console.log();

	const selectedServers = await checkbox({
		message: "Toggle MCP servers (active servers will be in ~/.claude.json):",
		choices: items,
		pageSize: 15,
	});

	return selectedServers;
}
