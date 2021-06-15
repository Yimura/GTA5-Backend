import EventModule from './structures/EventModule.js'
import WebServer from './structures/web/Server.js'

export default class Web extends EventModule {
    _server = new WebServer(this.config.webserver);

    /**
     * @param {Main} main The program entrypoint class
     */
    constructor(main) {
        super(main);

        this.register(Web, {
            name: 'web'
        });
    }

    _onError(err) {
        this.log.error('WEB', 'Webserver encountered an error:', err);
    }

    _onReady() {
        this.log.info('WEB', 'Webserver is ready.');
    }

    /**
     * Forward the request from the webserver so it can be handle externally
     * @param {Request} request
     */
    _onRequest(request) {
        this.emit('request', request);
    }

    /**
     * @returns {boolean} Return true if the init succeeded, false to exit the entire app
     */
    init() {
        this.log.info('WEB', 'Starting Webserver...');

        this._server.on('ready', this._onReady.bind(this));
        this._server.on('request', this._onRequest.bind(this));
        this._server.start();

        return true;
    }
}
