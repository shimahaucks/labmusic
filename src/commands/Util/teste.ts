import { Command, CommandContext } from 'lib/structures/types/Command';
import Client from 'lib/structures/Client';
import { MessageReaction, User, ReactionCollectorOptions, MessageCollectorOptions, MessageEmbed } from 'discord.js';
import * as moment from 'moment-timezone';

export default class SeniorCommand extends Command {
	client: Client;

	constructor(client: Client) {
		super(client, {
			name: 'teste',
			ownerOnly: true,
			aliases: [],
		});
	}

	async run({ message }: CommandContext): Promise<any> {
		const msg = await message.channel.send('I will store the next messages! React with :white_check_mark: when you have complete.');

		const emoji = '✅';
		const collect = [];
		await msg.react(emoji);

		const filterReaction = (reaction: MessageReaction, user: User): boolean => user.id === message.author.id && reaction.emoji.name === emoji;
		const optionsReaction: ReactionCollectorOptions = { max: 1, time: 100 * 1000 };

		const filterMessage = (): boolean => true;
		const optionsMessage: MessageCollectorOptions = { time: 1000 * 1000 };

		const reactionCollector = msg.createReactionCollector(filterReaction, optionsReaction);
		const messageCollector = msg.channel.createMessageCollector(filterMessage, optionsMessage);

		messageCollector.on('end', (collected) => {
			collected.map((c) => {
				return collect.push(`${moment(c.createdAt).format('YYYY-MM-DD HH:mm:ss')} ${c.author.tag} >> ${c.content}`);
			});
		});

		reactionCollector.on('collect', async () => {
			messageCollector.stop();

			if (!collect.length) return message.channel.send('No message has been sent!');

			message.channel.send(
				new MessageEmbed()
					.setTitle('LOGS')
					.setColor('#47A0F9')
					.setDescription(`\`\`\`fix\n${collect.join('\n')}\`\`\``)
			);
		});
	}
}
