import { resolve as resolvePath, join as joinPath } from 'path'

export async function resolve(specifier, context, defaultResolver) {
    if (specifier.startsWith('@/'))
        specifier = joinPath('file://', resolvePath('.'), specifier.replace(/^@\//, ''));

    return defaultResolver(specifier, context);
}
