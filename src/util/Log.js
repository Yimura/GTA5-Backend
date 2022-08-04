import fs from 'fs'
import util from 'util'

const level_types = ['VERBOSE', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'];

export default class log {
    static _logLevel = 'VERBOSE';
    constructor() {}

    /**
     * @param {string} level The level of logging to be used
     * @param {string} name The informative name from where the log came
     * @param {string} message
     * @param {*} [data=null] This can be anything that you want to add to the log
     * @param {boolean} [show_time=true] If the time of the log should be added with the log
     */
    static _log(level, name, message, data = null, show_time = true) {
        if (typeof name !== 'string' || typeof message !== 'string') throw new TypeError('Name and message argument expect a string.');

        level = level.toUpperCase();

        if (!level_types.includes(level)) throw new TypeError('Invalid logging level used!');

        let log = show_time ? `[${new Date().toLocaleTimeString()}] ` : '', colors = ['', ''];

        if (level_types.indexOf(this._logLevel) <= level_types.indexOf(level)) {
            switch (level) {
                case 'VERBOSE':
                    colors = ['\x1b[34m', '\x1b[0m'];
                    break;
                case 'INFO':
                    colors = ['\x1b[32m', '\x1b[0m'];
                    break;
                case 'WARNING':
                    colors = ['\x1b[33m', '\x1b[0m'];
                    break;
                case 'ERROR':
                    colors = ['\x1b[31m', '\x1b[0m'];
                    break;
                case 'CRITICAL':
                    colors = ['\x1b[31m', '\x1b[0m'];
                    break;
            }

            const msg = `${log}${colors[0]}[${name.toUpperCase()}/${level}]${colors[1]} ${message}`;

            console.log(msg);
            if (data) console.log(data);
        }

        const date = new Date();

        let msg = `${log}[${name.toUpperCase()}/${level}] ${message}\n`;
        if (data) msg += `${util.format(data)}\n`;

        fs.appendFile(
            `${process.cwd()}/log/${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}-${level.toLowerCase()}.log`,
            msg,
            (err) => {
                if (err) throw err;
            }
        );
    }

    static setLogLevel(level){
        level = level.toUpperCase();
        if (level_types.includes(level)) {
            log._logLevel = level
        }
        else {
            throw new TypeError('Invalid logging level used!');
        }

    }

    static info(...args) {
        log._log('info', ...args);
    }

    static verbose(...args) {
        log._log('verbose',...args);
    }

    static warn(...args) {
        log._log('warning', ...args);
    }

    static error(...args) {
        log._log('error', ...args);
    }

    static critical(...args) {
        log._log('critical', ...args);
    }
}
