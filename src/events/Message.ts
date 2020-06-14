import { Client, CommandContext, EventInstance } from 'lib';
import { Message } from 'discord.js';

export default class MessageEvent extends EventInstance {
	client: Client;

	events: string[];

	constructor(client: Client) {
		super(client, {
			events: ['message'],
		});
	}

	run(message: Message): void | Promise<Message> {
		if (message.author.bot || message.channel.type === 'dm') return;
		if (!message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) return;

		const prefixes = [`<@${this.client.user.id}`, `<@!${this.client.user.id}`, 'lm.'];
		const verifyPrefix = prefixes.find((select) => message.content.startsWith(select));

		if (typeof verifyPrefix === 'string' && message.content.length > verifyPrefix.length) {
			const args = message.content.slice(verifyPrefix.length).trim().split(/ +/g);
			const command = this.client.commands.get(args.shift());

			if (command) {
				const context = new CommandContext({
					client: this.client,
					args,
					message,
				});

				return command.processCommand(context);
			}
		}
	}
}
