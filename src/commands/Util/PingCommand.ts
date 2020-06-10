import { Command, CommandContext } from 'lib/structures/types/Command';
import Client from 'lib/structures/Client';

export default class PingCommand extends Command {
  client: Client;

  constructor(client: Client) {
    super(client, {
      name: 'ping',
      aliases: ['ws'],
      ownerOnly: false,
    });
  }

  async run({ message }: CommandContext): Promise<any> {
    const started = +new Date();
    const base = await message.channel.send('Ping?');
    return base.edit(
      [`Ping: **${base.createdTimestamp - message.createdTimestamp}**ms`, `WebSocket: **${~~this.client.ws.ping}**ms`, `Operations: **${+new Date() - started}**ms`].join('\n')
    );
  }
}
