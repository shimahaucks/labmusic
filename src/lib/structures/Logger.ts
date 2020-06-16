import { bgGreen, bgRed, red, magenta } from 'chalk';
import * as moment from 'moment-timezone';

moment.tz('America/Sao_Paulo');

class Logger {
	static log(type: string, ...message: string[]): undefined | void {
		switch (type) {
			case 'log':
				console.log(`${bgGreen(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)} ${magenta(message.join(' '))}`);
				break;
			case 'error':
				console.log(`${bgRed(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]`)} ${red(message.join(' '))}`);
				break;
			default:
				return console.log(message);
		}
	}
}

export default Logger;
