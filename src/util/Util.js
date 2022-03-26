import { readFileSync } from 'fs'

export const loadJson = (path) => {
    try {
        return JSON.parse(readFileSync(process.cwd() + path));
    }
    catch (err) {
        return null;
    }
}

export default {
    loadJson
};
