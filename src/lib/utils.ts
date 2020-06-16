import { Client } from 'lib';

const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;
const zws = String.fromCharCode(8203);
let sensitivePattern;
class Util {
	static isFunction(input: any): boolean {
		return typeof input === 'function';
	}

	static isThenable(input: any): boolean {
		if (!input) return false;
		return input instanceof Promise || (input !== Promise.prototype && Util.isFunction(input.then) && Util.isFunction(input.catch));
	}

	static clean(client: Client, text: string): string {
		sensitivePattern = new RegExp(Util.regExpEsc(client.token), 'gi');
		return text.replace(sensitivePattern, '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`);
	}

	static regExpEsc(str: string): string {
		return str.replace(REGEXPESC, '\\$&');
	}

	static codeBlock(lang: string, expression: string): string {
		return `\`\`\`${lang}\n${expression || zws}\`\`\``;
	}

	static parseFlags(content: string): any {
		const flags = {
			_: content,
		};
		const flagsRegex = /--[a-z0-A]+/g;

		const parser = content.match(flagsRegex);
		if (!parser) return flags;

		for (let index = 0; index < parser.length; index++) {
			const arg = parser[index].slice(2);
			flags[arg] = arg;
			flags._ = content.replace(parser[index], '');
		}

		return flags;
	}
}

export default Util;
