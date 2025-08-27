#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import { toggleMcpServers } from "./manager.js";
import { showServerToggleUI } from "./ui.js";

const program = new Command();

program
	.name("claude-ext")
	.description("Claude MCP Server Manager")
	.version("1.0.0")
	.argument("[command]", "mcp command")
	.action(async (command?: string) => {
		if (command === "mcp") {
			try {
				const selectedServers = await showServerToggleUI();
				if (selectedServers.length >= 0) {
					toggleMcpServers(selectedServers);
				}
			} catch (error) {
				console.error(chalk.red("Error:"), error);
				process.exit(1);
			}
		} else {
			program.help();
		}
	});

program.parse();
