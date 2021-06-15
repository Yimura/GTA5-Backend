import { resolve as resolvePath } from 'path'

export async function resolve(specifier, context, defaultResolver) {
    specifier = specifier.replace(/^@\//, resolvePath('.') + '/');

    return defaultResolver(specifier, context);
}
