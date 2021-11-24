import { Channel, connect, Connection } from 'amqplib';
import { Message, Replies } from 'amqplib/properties';
import { Config } from '../../config/config';
import { ErrorCodes } from '../errors/ErrorCodes';
import { InternalError } from '../errors/InternalError';
import { Logger } from '../logger/logger';
import { ConsumerInterface } from './ConsumerInterface';
import { RabbitMessageReceiverInterface } from './RabbitMessageReceiverInterface';

export interface RabbitServiceConfig {
    exchange: string;
    queue: string;
    routingKey: string;
}

export class Consumer implements ConsumerInterface {
    private mainConfig = {
        host: Config.get('rabbit.main.host'),
        username: Config.get('rabbit.main.username'),
        password: Config.get('rabbit.main.password'),
        port: Config.get('rabbit.main.port'),
    };

    private serviceConfig: RabbitServiceConfig = null;
    private parser: RabbitMessageReceiverInterface = null;
    private connection: Connection = null;
    private channel: Channel = null;
    private queue: Replies.AssertQueue = null;

    private closedByClient = false;

    private static triedToReconnectTimes = 0;
    private static maxReconnectTimes = 3;

    private logger: Logger = null;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    async connect(): Promise<Consumer> {
        try {
            this.connection = await connect(`amqp://${ this.mainConfig.username }:${ this.mainConfig.password }@${ this.mainConfig.host }:${ this.mainConfig.port }?heartbeat=60`);
            this.connection.on('error', async () => await this.reconnect());
            this.connection.on('close', async () => this.closedByClient ? null : await this.reconnect());
            this.logger.info('Successfully connected to rabbit');
        } catch (err) {
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_CONNECTION_FAILED, `${ err }`);
        }
        return this;
    }

    async closePossibleConnection(): Promise<void> {
        try {
            if (this.connection) {
                this.closedByClient = true;
                await this.connection.close();
                this.closedByClient = false;
            }
        } catch (err) {
            if (!this.closedByClient) {
                const error = new InternalError(`${ this.constructor.name }`, ErrorCodes.UnexpectedError, `${ err }`);
                error.renderError();
                return;
            }
        }
    }

    async reconnect(): Promise<void> {
        await this.closePossibleConnection();

        this.connection = null;
        this.channel = null;
        this.queue = null;

        try {
            this.retriesCheck();
            await (await this.init(this.serviceConfig, this.parser)).consume();
        } catch (err) {
            if (err instanceof InternalError && err.errorCode === ErrorCodes.RABBIT_RECONNECT_FAILED) {
                err.renderError();
                return;
            }
            await new Promise(res => setTimeout(res, 1_000));
            await this.reconnect();
        }
    }

    retriesCheck(): void {
        Consumer.triedToReconnectTimes++;
        if (Consumer.triedToReconnectTimes > Consumer.maxReconnectTimes) {
            Consumer.triedToReconnectTimes = 0;
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_RECONNECT_FAILED);
        }
    }

    async createChannel(): Promise<Consumer> {
        try {
            this.channel = await this.connection.createChannel();
        } catch (err) {
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_CREATE_CHANNEL_FAILED, `${ err }`);
        }
        return this;
    }

    async assertExchange(): Promise<Consumer> {
        try {
            await this.channel.assertExchange(this.serviceConfig.exchange, 'topic', { durable: true });
        } catch (err) {
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_ASSERT_EXCHANGE_FAILED, `${ err }`);
        }
        return this;
    }

    async assertQueue(): Promise<Consumer> {
        try {
            this.queue = await this.channel.assertQueue(this.serviceConfig.queue, { exclusive: false });
        } catch (err) {
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_ASSERT_QUEUE_FAILED, `${ err }`);
        }
        return this;
    }

    async bindQueue(): Promise<Consumer> {
        try {
            await this.channel.bindQueue(this.queue.queue, this.serviceConfig.exchange, this.serviceConfig.routingKey);
        } catch (err) {
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_BIND_QUEUE_FAILED, `${ err }`);
        }
        return this;
    }

    async init(config: RabbitServiceConfig, parser: RabbitMessageReceiverInterface): Promise<ConsumerInterface> {
        this.logger.warning('trying to init')
        this.serviceConfig = config;
        this.parser = parser;

        await this.connect();
        await this.createChannel();
        await this.assertExchange();
        await this.assertQueue();
        await this.bindQueue();

        return this;
    }

    async consume(): Promise<void> {
        try {
            await this.channel.consume(this.queue.queue, async (msg: Message) => {
                try {
                    await this.parser.receiveMessage(msg);
                    this.channel.ack(msg);
                } catch (err) {
                    const internalError = err instanceof InternalError ? err : new InternalError(
                        `${ this.constructor.name }`,
                        ErrorCodes.UnexpectedError,
                        `OriginalError: ${ err }. Message: ${ msg }`,
                    );
                    internalError.renderError();
                    this.channel.reject(msg, false);
                }
            });
            this.logger.info('Successfully start consuming messages.');
        } catch (err) {
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.RABBIT_CONSUME_FAILED, `${ err }`);
        }
    }
}
