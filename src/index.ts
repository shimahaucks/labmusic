import { config } from 'dotenv';
import { Client } from 'lib';

const client = new Client();
config();

client.loadHandlers('src/lib/structures/handlers');
client.login();
