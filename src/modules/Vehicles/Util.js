export const createShareCode = () => {
    return [0,0,0].map((_) => Math.floor(Math.random() * (4095 - 256) + 256).toString(16).toUpperCase()).join('-');
};

export default {
    createShareCode
}
