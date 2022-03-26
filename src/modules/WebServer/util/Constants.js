export const SortFunction = (a, b) => b[0].length - a[0].length;

export const DefaultAllowedHeaders = [
    'Accept',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Headers',
    'Access-Control-Request-Method',
    'Content-Type',
    'Origin',
];
export const DefaultAllowedMethods = [
    'DELETE',
    'GET',
    'HEAD',
    'PATCH',
    'POST',
    'PUT'
];

export const HttpResponseCode = {
    400: {
        code: 400,
        status: '400 - Bad Request',
        message: 'The server did not understand the request, an invalid request body or headers may have been given.'
    },
    401: {
        code: 401,
        status: '401 - Unauthorized',
        message: 'The client failed to authenticate.'
    },
    403: {
        code: 403,
        status: '403 - Permission Denied',
        message: 'The client does not have permission to access the requested resource.'
    },
    404: {
        code: 404,
        status: '404 - Not Found',
        message: 'The requested resource has not been found.'
    },
    405: {
        code: 405,
        status: '405 - Method Not Allowed',
        message: 'The given URL exists but an invalid request method was used.'
    },
    406: {
        code: 406,
        status: '406 - Not Acceptable',
        message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.'
    },
    409: {
        code: 409,
        status: '409 - Conflict',
        message: 'The request could not be completed due to a conflict with the current state of the target resource.'
    },
    413: {
        code: 413,
        status: '413 - Payload Too Large',
        message: 'Request entity is larger than the limits defined by the server.'
    },
    500: {
        code: 500,
        status: '500 - Internal Server Error',
        message: 'An error occured, please contact an administrator if the problem persists.'
    }
};

export const WebServerConfig = {
    allowed_headers: [],
    allowed_origins: [],
    host: '0.0.0.0',
    port: 8080
};

export default {
    DefaultAllowedHeaders,
    DefaultAllowedMethods,
    HttpResponseCode,
    SortFunction,
    WebServerConfig
};
