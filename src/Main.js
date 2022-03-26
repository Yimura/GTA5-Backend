import Modules from 'waffle-manager';
import { resolve as resolvePath } from 'path';

export class Main {
    constructor() {
        ['beforeExit', 'SIGTERM', 'SIGINT'].map(signal => process.on(signal, this.cleanup.bind(this)));
    }

    async cleanup() {
        await Modules.cleanup();

        process.exit();
    }

    async init() {
        await Modules.load(null, resolvePath('./src/modules/'));
    }
}