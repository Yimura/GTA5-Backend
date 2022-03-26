import EventEmitter from 'events';
import http, { Server } from 'http';
import { ModuleBuilder } from 'waffle-manager';
import { Logger } from '@/src/util/Logger.js';
import { loadJson } from '@/src/util/Util.js';
import { HTTPRequest } from './structures/HTTPRequest.js';
import Constants, { DefaultAllowedHeaders, DefaultAllowedMethods, SortFunction, WebServerConfig } from './util/Constants.js';

export const ModuleConstants = Constants;

export const ModuleInfo = new ModuleBuilder('webServer');

export const ModuleInstance = class WebServer extends EventEmitter {
    constructor() {
        super();

        this._config = {}
        this._defaultHeaders = {};
        this._handlers = [];
        this._s = new Server();
    }

    get host() {
        return this._config.host;
    }

    get port() {
        return this._config.port;
    }

    /**
     * Adds a request handler for the given path.
     * @param {string} path The path to be handle by said path handler.
     * @param {function} handler The callback to the function handling the request.
     */
    addPathHandler(path, handler) {
        if (!path instanceof String)
            throw new Error('Path is not of type String.');
        if (typeof handler !== 'function')
            throw new Error('Handler is not a function.');

        this._handlers.push([path, handler]);
        this._handlers.sort(SortFunction);

        Logger.info('WEB_SERVER', `Registered new handler for path "${path}"`);
    }

    /**
     *
     * @param {HTTPRequest} httpRequest
     * @returns
     */
    applyDynamicHeaders(httpRequest) {
        const reqOrigin = httpRequest.getHeader('origin');
        const origin = this._config.allowed_origins.find(origin => origin == reqOrigin);

        return Object.assign({}, this._defaultHeaders, { 'Access-Control-Allow-Origin': origin ?? null });
    }

    buildHeaders() {
        const allowedHeaders = this._config.allowed_headers.concat(DefaultAllowedHeaders);
        return {
            'Access-Control-Allow-Headers': allowedHeaders.join(','),
            'Access-Control-Allow-Methods': DefaultAllowedMethods.join(',')
        };
    }

    cleanup() {
        this._s.close();
    }

    /**
     *
     * @param {HTTPRequest} httpRequest
     * @returns {boolean} Returns true if the request was a preflight request, false otherwise
     */
    handlePreflight(httpRequest) {
        const headers = this.applyDynamicHeaders(httpRequest);

        httpRequest.setHeaders(headers, false);
        if (httpRequest !== 'OPTIONS')
            return false;

        httpRequest.accept('', 204);
        return true;
    }

    /**
     * @returns {WebServerConfig}
     */
    loadConfig() {
        const { web_server } = loadJson('/data/config.json');
        return Object.assign({}, WebServerConfig, web_server);
    }

    async init() {
        this._config = this.loadConfig();
        this._defaultHeaders = this.buildHeaders();

        this._s.on('listening', this.onListening.bind(this));
        this._s.on('request', this.onRequest.bind(this));
        this._s.listen(this.port, this.host);

        return true;
    }

    onListening() {
        Logger.info("WEB_SERVER", `Server listening on: ${this.host}:${this.port}`);
    }

    /**
     * "request" event handler
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    async onRequest(request, response) {
        const httpRequest = new HTTPRequest(request, response);
        if (this.handlePreflight(httpRequest))
            return;

        for (const [ path, handler ] of this._handlers) {
            if (httpRequest.path.startsWith(path)) {
                await handler(httpRequest);

                return;
            }
        }

        response.end(`<pre>No handler registered for path: ${httpRequest.path}</pre>`);
    }
};
