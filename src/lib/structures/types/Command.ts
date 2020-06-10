import { Message } from 'discord.js';
import Client from 'lib/structures/Client';

import { CommandProps } from './CommandProps';

export abstract class Command {
  readonly client: Client;

  readonly message: Message;

  readonly name: string;

  readonly aliases: string[];

  readonly ownerOnly: boolean;

  constructor(client: Client, options: CommandProps) {
    this.client = client;
    this.name = options.name;
    this.aliases = options.aliases || [];
    this.ownerOnly = options.ownerOnly;
  }

  processCommand(ctx: CommandContext): void {
    const { author, channel } = ctx.message;

    if (this.ownerOnly && !this.client.owners.has(author.id))
      channel.send('Você não tem permissão.');

    return this.run(ctx);
  }

  abstract run(ctx: CommandContext): void;
}

export class CommandContext {
  client: Client;

  message: Message;

  args: string[];

  constructor(options) {
    Object.assign(this, options);
  }
}
