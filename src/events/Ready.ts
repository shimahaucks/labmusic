import Client from 'lib/structures/Client';
import EventInstance from 'lib/structures/types/Event';

export default class ReadyEvent extends EventInstance {
  client: Client;

  events: string[];

  constructor(client: Client) {
    super(client, {
      events: ['ready'],
    });
  }

  run(): void {
    this.client.log('log', `Conectado com sucesso em ${this.client.user.tag}`);
  }
}
