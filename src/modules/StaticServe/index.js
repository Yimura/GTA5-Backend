import { access } from 'fs/promises';
import { constants, createReadStream } from 'fs';
import { resolve as resolvePath } from 'path';
import mime from 'mime/lite.js'
import Modules, { ModuleBuilder } from 'waffle-manager';

export const ModuleInfo = new ModuleBuilder('staticServer')
    .addRequired('webServer')
    .setDisabled();

export const ModuleInstance = class StaticServe {
    constructor() {

    }

    init() {
        Modules.webServer.addPathHandler('/', this.onRequest.bind(this));

        return true;
    }

    /**
     * Checks if a file path is readable for this process
     * @param {string} filePath
     * @returns {boolean}
     */
    async _isReadable(filePath) {
        try {
            return await access(filePath, constants.R_OK) == undefined;
        } catch (error) {
            return false;
        }
    }

    /**
     *
     * @param {HTTPRequest} request
     * @returns {boolean}
     */
    async onRequest(request) {
        const pathName = request.url.pathname;
        const path = resolvePath(`./frontend${pathName.endsWith('/') ? '/index.html' : pathName}`);
        if (!await this._isReadable(path))
            return request.reject(404);

        const mimeType = mime.getType(path);
        if (!mimeType)
            return request.reject(500);

        request.res.writeHead(200, { 'Content-Type': mimeType });
        createReadStream(path).pipe(request.res);

        return true;
    }
}
