import fs from 'fs';

export const loadJson = (path) => {
    try {
        return JSON.parse(fs.readFileSync(process.cwd() + path));
    }
    catch (err) {
        return null;
    }
}

export default {
    loadJson
}
