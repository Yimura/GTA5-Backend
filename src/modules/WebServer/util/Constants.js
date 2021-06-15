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
    406: {
        code: 406,
        status: '406 - Not Acceptable',
        message: 'After Processing the Request Body the server did not find the content that was needed to complete the request.'
    },
    413: {
        code: 413,
        status: '413 - Payload Too Large',
        message: 'Request entity is larger than the limits defined by the server.'
    }
};

export default {
    HttpResponseCode
};
