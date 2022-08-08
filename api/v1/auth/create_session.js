import Modules from '@/src/managers/Modules.js';
import { performance } from 'perf_hooks'

export default class CreateSession extends Modules.REST.Route {
    constructor(main) {
        super(main);
        this.timeTaken = 4.268612000159919;
    }

    get route() {
        return '/create_session';
    }

    get time() {
        return this.timeTaken
    }

    /**
     * Sets the last truthy time taken
     * @param {Number} ms The ms it took to complete
     */
    set time(ms) {
        if (ms >= 1000) return;
        this.timeTaken = ms + this.#randomMs()
    }

    /**
     * Returns a random float in range
     * @param {Number} min The min of the range
     * @param {Number} max The max of the range 
     * @returns The ms in the specified range
     */
    #randomMs(min = 5, max = 250) {
        return Math.random() * (max - min) + min
    }

    /**
     * Wait a specified of amount of ms
     * @param {Number} ms The amount of ms to wait for
     * @returns {Promise}
     */
    #sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Protects against timing attacks by waiting a set amount of time.
     * @param {Number} startTime The time the request started at
     */
    async #timingAttackProtect(startTime) {
        const timePassed = performance.now() - startTime
        if (this.time > timePassed) {
            const sleepFor = this.time - timePassed
            await this.#sleep(sleepFor)
        } else {
            this.time = performance.now() - startTime
        }
    }

    /**
     *
     * @param {Modules.web.Request} request
     * @returns {boolean}
     */
    async post(request) {
        const startedAt = performance.now();
        const body = await request.json();
        if (!body || !body.rockstar_id || !body.username) return request.reject(400, {
            status: 'fail',
            data: {
                ...(!body.username && { username: 'This field is required.' }),
                ...(!body.rockstar_id && { rockstar_id: 'This field is required.' })
            }
        });

        const search = Object.assign({}, body);
        delete search.username;

        let user = await Modules.Users.get(search);
        if (!user) {
            try {
                user = await Modules.Users.create(body);
            } catch (err) {
                this.log.error('REST', `An error occured on "${request.url}":`, err);

                await this.#timingAttackProtect(startedAt);
                return request.accept({
                    status: 'success',
                    data: {
                        sessionId: Modules.Sessions.create(user, true),
                        ...(this.config.development && { time: this.time, fake: true })
                    }
                });
            }
        }

        await this.#timingAttackProtect(startedAt);
        return request.accept({
            status: 'success',
            data: {
                sessionId: Modules.Sessions.create(user),
                ...(this.config.development && { time: this.time, fake: false })
            }
        });
    }
}
