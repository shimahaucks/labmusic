import Client from 'lib/structures/Client';

interface EventOptions {
	events: string[];
}

export default class Event {
	client: Client;

	events: string[];

	constructor(client: Client, options: EventOptions) {
		this.client = client;
		this.events = options.events;
	}

	public run(args: any) {
		throw new Error(`Run não estabelecido em ${this.events[0]}`);
	}
}
