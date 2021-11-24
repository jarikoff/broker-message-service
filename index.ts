import * as express from 'express';
import * as http from 'http';
import { Logger } from './src/logger/logger';
import { WorkerManager } from './src/workers/WorkerManager';

const port = 3050;
const logger: Logger = new Logger('index');

process.on('uncaughtException', (err) => {
    logger.error('Caught uncaught exception', err);
});

const app = express();
app.set('port', port);

app.use('*', (req, res, next) => {
    res.status(404).json([ { response: 'Route Undefined' } ]);
});

const server = http.createServer(app);
server.listen(port);
server.on('listening',  (): void => {
    const address = server.address();
    const bind = (typeof address === 'string') ? `pipe ${ address }` : `port ${ address.port }`;
    logger.info(`Listening on ${ bind }`);
    setTimeout(() => WorkerManager.getInstance().initWorkers(), 2_000); // await until rabbitmq is up
});
