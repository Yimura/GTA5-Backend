import http from 'http'
import { EventEmitter } from 'events'
import Request from './Request.js'

export default class Server extends EventEmitter {
    /**
     * @param {{
     *  allow_headers: !Array<string>
     *  allow_methods: !Array<string>
     *  port: number
     * }} config
     */
    constructor(config) {
        super();

        this._ = http.createServer();

        this.config = config;
    }

    /**
     * @param {http.IncomingMessage} req
     */
    getHeaders(req) {
        return {
            'Access-Control-Allow-Credentials': false,
            'Access-Control-Allow-Headers': this.config.allow_headers.reduce(reduceFun, ''),
            'Access-Control-Allow-Methods': this.config.allow_methods.reduce(reduceFun, ''),
            'Access-Control-Allow-origin': this._matchOrigin(req.headers.origin)
        }
    }

    /**
     * Forwards underlying webserver errors
     * @param {Error} err HTTP Webserver error
     */
    onError(err) {
        this.emit('error', err);
    }

    /**
     * Handles incoming request and wraps them in a helper Request class
     * @param {http.IncomingMessage} req
     * @param {http.ServerResponse} res
     */
    onRequest(req, res) {
        if (this._handlePreflight(req,res )) return;

        this.emit('request', new Request(this, req, res))
    }

    /**
     * Emits whenever the web server started listening on its TCP port
     */
    onListening() {
        this.emit('ready');
    }

    /**
     * Set the webserver's events and start listening on its port
     */
    start() {
        this._.on('request', this.onRequest.bind(this));
        this._.on('error', this.onError.bind(this));
        this._.on('listening', this.onListening.bind(this));

        this._.listen(this.config.port);
    }

    _handlePreflight(req, res) {
        const method = req?.method.toLowerCase();

        if (method === 'options') {
            res.writeHead(204, this.getHeaders(req));
            res.end();

            return true;
        }
        return false;
    }

    /**
     * Matches the given origin with one of the origins in the config file
     * @param {string} origin
     */
    _matchOrigin(origin) {
        if (this.config.origins.includes(origin)) return origin;
        return this.config.origins[0];
    }
}

const reduceFun = (accum, value) => accum !== '' ? accum += ',' + value : accum = value;
