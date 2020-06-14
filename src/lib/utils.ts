import Client from '@DiscordClient';

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
}

export default Util;
