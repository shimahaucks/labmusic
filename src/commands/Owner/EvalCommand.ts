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
		const flags = Utils.parseFlags(args.join(' '));
		let inserted: string = flags._;
		if ('async' in flags) inserted = `(async () => {\n${inserted}\n})()`;

		const { success, result, type } = await this.eval(message, flags, inserted);

		if (!('silent' in flags))
			message.channel.send(`**${success ? 'Output:' : 'Error:'}** ${Utils.codeBlock('js', Utils.clean(this.client, result))}\n**Tipo:** ${Utils.codeBlock('ts', type)}`);
	}

	async eval(message, flags, code: string): Promise<EvalReturn> {
		// eslint-disable-next-line no-param-reassign
		code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const msg = message;

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
				depth: parseInt(flags.depth) || 0,
				showHidden: Boolean(flags.showHidden),
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
