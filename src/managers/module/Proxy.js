/**
 * @param {Object} target The Object/Class/Function to be proxied
 * @param {string} prop The property being accessed
 * @param {Object} receiver Either the proxy or an object that inherits from the proxy
 */
 const get = (target, prop, receiver) => {
    if (typeof target[prop] !== 'undefined') return target[prop];
    return target.get(prop);
};

export default class ModuleProxy {
    constructor() {
        return new Proxy(this, {
            get
        });
    }
}
