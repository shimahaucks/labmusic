import { Client as Instance, Collection, User } from 'discord.js';
import { Command } from 'lib/structures/types/Command';

import { promises } from 'fs';
import { resolve } from 'path';
import Logger from './Logger';

const { readdir } = promises;

class Client extends Instance {
  readonly commands: Collection<string, Command> = new Collection();

  readonly owners: Collection<string, User> = new Collection(
    ['379727083284463626'].map((id) => [id, this.users.cache.get(id)])
  );

  log: Function = Logger.log;

  public login(token = process.env.TOKEN): Promise<string> {
    return super.login(token);
  }

  public async loadHandlers(directory: string): Promise<void> {
    const files = await readdir(directory);

    for (let index = 0; index < files.length; index++) {
      const fullPath = resolve(directory, files[index]);

      const ImportedHandler = await import(fullPath);
      const HandlerClass = ImportedHandler.default || ImportedHandler;
      const handler = new HandlerClass(this);

      await handler.load();
      this.log('log', `Todos os ${handler.name} carregados!`);
    }
  }
}

export default Client;
