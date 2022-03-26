import { resolve as resolvePath } from 'path'

/**
 * 
 * @param {string} specifier 
 * @param {object} context 
 * @param {object} defaultResolver 
 * @returns 
 */
export async function resolve(specifier, context, defaultResolver) {
    return defaultResolver(
        specifier.startsWith('@')
            ? specifier.replace(/^@\//, resolvePath('.') + '/')
            : specifier,
        context
    );
}
