import http from 'http';
import { HttpResponseCode } from '../util/Constants.js';

export class HTTPRequest {
    /**
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse} response
     */
    constructor(request, response) {
        this._headers = {};

        this._req = request;
        this._res = response;

        this._url = new URL('d://ummy' + this.req.url);
        this._search = new URLSearchParams(this.url.search);
    }

    /**
     * @returns {object}
     */
    get headers() {
        return this.req.headers;
    }

    /**
     * @returns {string}
     */
    get method() {
        return this._req.method.toUpperCase();
    }

    /**
     * @returns {string}
     */
    get path() {
        return this._url.pathname;
    }

    /**
     * @returns {http.IncomingMessage}
     */
    get req() {
        return this._req;
    }

    /**
     * @returns {http.ServerResponse}
     */
    get res() {
        return this._res;
    }

    /**
     * @returns {URLSearchParams}
     */
    get searchParams() {
        return  this._search;
    }

    /**
     * @returns {URL}
     */
    get url() {
        return this._url;
    }

    /**
     * Retrieve request headers
     * @param {string} name Header name
     * @returns {string} The value the header holds
     */
    getHeader(name) {
        return this.req.headers[name];
    }

    /**
     * Set the value
     * @param {string} name The header name
     * @param {string} value The header value
     */
    setHeader(name, value) {
        this._headers[name] = value;
    }

    /**
     * Merge a header object or overwrite existing header object
     * @param {object} headers Headers to merge with existing headers or assign as new headers
     * @param {boolean} merge True to merge with existing headers, false to overwrite
     */
    setHeaders(headers, merge = true) {
        if (merge)
            Object.assign(this._headers, headers);
        else
            this._headers = headers;
    }

    /**
     * Use this method to signal a successful handling of a request, HTTP response codes within the 200 range can be used.
     * @param {string|object} body Body to send as a response, can be a string or a JS Object.
     * @param {number} code HTTP response code between 200 and 299.
     * @returns {boolean}
     */
    accept(body, code = 200) {
        if (code < 200 || code > 299)
            throw new RangeError('The HTTP response code for HTTPRequest#success needs to be between 200 and 299.');

        this.res.writeHead(code, this._headers);
        this.res.end(body);

        return true;
    }

    /**
     * Indicate that an error occured because a client made an invalid request.
     * @param {number} code HTTP response code between 400 and 599.
     * @param {string|object} [customBody = null]
     */
    reject(code, customBody = null) {
        this.res.writeHead(code, this._headers);
        if (!customBody)
        {
            const { status, message } = HttpResponseCode[code];
            this.res.end(`<pre>${status}<br><br>${message}</pre>`);

            return true;
        }
        return this.res.end(customBody);
    }
}
