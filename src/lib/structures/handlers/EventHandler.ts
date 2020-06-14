import { promises } from 'fs';
import { resolve } from 'path';

import Client from 'lib/structures/Client';

const { readdir } = promises;

export default class EventHandler {
	public client: Client;

	public name: string;

	constructor(client: Client) {
		this.client = client;
		this.name = 'eventos';
	}

	load = (): Promise<void> => this.initLoader('src/events');

	async initLoader(path: string): Promise<void> {
		const files = await readdir(path);

		for (let index = 0; index < files.length; index++) {
			const fullPath = resolve(path, files[index]);

			const ImportedEvent = await import(fullPath);
			const EventClass = ImportedEvent.default || ImportedEvent;

			const event = new EventClass(this.client);

			event.events.map((name) => {
				return this.client.on(name, (...args) => event.run(...args));
			});
		}
	}
}
