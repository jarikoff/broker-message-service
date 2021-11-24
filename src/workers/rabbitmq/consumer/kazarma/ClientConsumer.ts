import { Config } from '../../../../../config/config';
import { ErrorCodes } from '../../../../errors/ErrorCodes';
import { InternalError } from '../../../../errors/InternalError';
import { ActionFactory } from '../../../../factories/ActionFactory';
import { ClientBuilder } from '../../../../factories/client/ClientBuilder';
import { Consumer, RabbitServiceConfig } from '../../../../rabbitmq/Consumer';
import { WorkerInterface } from '../../../WorkerInterface';
import { ClientMessageReceiver } from './ClientMessageReceiver';

export class ClientConsumer extends Consumer implements WorkerInterface {
    async start(): Promise<void> {
        const config: RabbitServiceConfig = {
            exchange: Config.get('rabbit.services.kazarma.exchange'),
            queue: Config.get('rabbit.services.kazarma.queue'),
            routingKey: Config.get('rabbit.services.kazarma.routing_key'),
        };

        try {
            const consumable = await this.init(config, new ClientMessageReceiver(new ActionFactory(new ClientBuilder())));
            await consumable.consume();
        } catch (err) {
            const internalError = err instanceof InternalError ? err : new InternalError(
                `${ this.constructor.name }`,
                ErrorCodes.UnexpectedError,
                `OriginalError: ${ err }`,
            );
            internalError.renderError();
            if (internalError.errorCode === ErrorCodes.RABBIT_CONNECTION_FAILED) {
                await this.reconnect();
            }
        }
    }
}
