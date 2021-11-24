import { ConsumeMessage } from 'amqplib/properties';
import { ActionBuilderInterface } from '../factories/ActionBuilderInterface';
import { RabbitMessageReceiverInterface } from './RabbitMessageReceiverInterface';

export abstract class RabbitMessageReceiver implements RabbitMessageReceiverInterface {
    protected builder: ActionBuilderInterface = null;

    constructor(builder: ActionBuilderInterface) {
        this.builder = builder;
    }

    abstract receiveMessage(message: ConsumeMessage | null);
}
