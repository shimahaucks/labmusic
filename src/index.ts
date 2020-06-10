import 'dotenv/config';
import Client from 'lib/structures/Client';

const client = new Client();

client.loadHandlers('src/lib/structures/handlers');
client.login();
