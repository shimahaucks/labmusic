import Client from 'lib/structures/Client';
import { PresenceData } from 'discord.js';
import EventInstance from 'lib/structures/types/Event';

export default class ReadyEvent extends EventInstance {
	client: Client;

	events: string[];

	index = 0;

	delay: number = 30 * 1000;

	constructor(client: Client) {
		super(client, {
			events: ['ready'],
		});
	}

	run(): void {
		this.client.log('log', `Conectado com sucesso em ${this.client.user.tag}`);
		this.rotate();
		this.client.setInterval(this.rotate.bind(this), this.delay);
	}

	rotate(): void {
		if (this.index >= this.presences.length) this.index = 0;

		this.client.user.setPresence(this.presences[this.index++]);
	}

	get presences(): PresenceData[] {
		return [
			{
				status: 'online',
				activity: {
					name: `💤`,
					type: 'LISTENING',
				},
			},
			{
				status: 'dnd',
				activity: {
					name: `Desenvolvido por ${this.client.owners.first().tag}`,
				},
			},
		];
	}
}
