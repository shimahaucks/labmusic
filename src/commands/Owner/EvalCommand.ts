/* eslint-disable no-eval */
import { Command, CommandContext, Utils, Type, Client } from 'lib';
import { inspect } from 'util';

interface EvalReturn {
	result: any;
	success: boolean;
	thenable: boolean;
	type: any;
}

export default class Eval extends Command {
	constructor(client: Client) {
		super(client, {
			name: 'eval',
			ownerOnly: true,
			aliases: ['ev', 'e'],
		});
	}

	async run({ message, args }: CommandContext): Promise<void> {
		let inserted: string = args.join(' ').replace(new RegExp('--async', 'g'), '').replace(new RegExp('--silent', 'g'), '');

		if (args.includes('--async')) inserted = `(async () => {\n${inserted}\n})()`;

		const { success, result, type } = await this.eval(inserted);

		message.channel.send(`**${success ? 'Output:' : 'Error:'}** ${Utils.codeBlock('js', Utils.clean(this.client, result))}\n**Tipo:** ${Utils.codeBlock('ts', type)}`);
	}

	async eval(code: string): Promise<EvalReturn> {
		// eslint-disable-next-line no-param-reassign
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

		let success;
		let result;
		let thenable = false;
		let type;

		try {
			result = eval(code);
			type = new Type(result);

			if (Utils.isThenable(result)) {
				thenable = true;
				result = await result;
			}
			success = true;
		} catch (error) {
			type = new Type(error);
			result = error;
			success = false;
		}
		if (typeof result !== 'string') {
			result = inspect(result, {
				depth: 0,
				showHidden: false,
			});
		}

		return {
			success,
			result,
			thenable,
			type,
		};
	}
}
