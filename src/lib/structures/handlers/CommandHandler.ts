import { promises } from 'fs';
import { resolve } from 'path';

import Client from 'lib/structures/Client';

const { readdir, lstat } = promises;

export default class CommandHandler {
	public client: Client;

	public name: string;

	constructor(client: Client) {
		this.client = client;
		this.name = 'comandos';
	}

	load = (): object => this.initLoader('src/commands');

	async initLoader(path: string): Promise<void> {
		const files = await readdir(path);

		for (let i = 0; i < files.length; i++) {
			const fullPath = resolve(path, files[i]);

			if ((await lstat(fullPath)).isDirectory()) {
				await this.initLoader(fullPath);
				continue;
			}

			const ImportedCommand = await import(fullPath);
			const CommandClass = ImportedCommand.default || ImportedCommand;
			const command = new CommandClass(this.client);

			this.client.commands.set(command.name, command);
		}
	}
}
