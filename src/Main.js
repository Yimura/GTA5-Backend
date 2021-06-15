import Modules from './managers/Modules.js'
import log from './util/Log.js'
import { loadJson } from './util/Util.js'

export default class Main {
    constructor() {
        this._a = loadJson('/data/auth.json');
        this._c = loadJson('/data/config.json');
    }

    get auth() {
        return this._a;
    }

    get config() {
        return this._c;
    }

    get log() {
        return log;
    }

    async start() {
        await Modules.load(this);
    }

    stop() {
        this.log.info('MAIN', 'Stopping server...');

        Modules.cleanup();

        process.exit(0);
    }
}
