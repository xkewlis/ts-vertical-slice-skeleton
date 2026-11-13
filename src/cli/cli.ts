#!/usr/bin/env bun
import { Command } from "commander";
import { registerMigrationCommands } from "@/cli/migration/migration.command";

const program = new Command()
    .name('bun run cli')
    .description('Administration tools')
    .showHelpAfterError()
    .showSuggestionAfterError()
    .action(() => program.outputHelp());

registerMigrationCommands(program);

void program.parseAsync(process.argv);
