
import Main from '@/src/Main.js'

const main = new Main();
main.start();

process.on('SIGTERM', main.stop.bind(main));
process.on('SIGINT', main.stop.bind(main));

process.on('unhandledRejection', (err) => main.log.error('PROCESS', 'Uncaught process exception:', err));
