import { checkbox } from "@inquirer/prompts";
import chalk from "chalk";
import { getAllMcpServers } from "./config.js";
import type { ServerToggleItem } from "./types.js";

export function createServerToggleItems(): ServerToggleItem[] {
	const { active, disabled } = getAllMcpServers();
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

	return items.sort((a, b) => a.value.localeCompare(b.value));
}

export async function showServerToggleUI(): Promise<string[]> {
	const items = createServerToggleItems();

	if (items.length === 0) {
		console.log(
			chalk.yellow(
				"No MCP servers found in ~/.claude.json or ~/.claude-ext.json",
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
