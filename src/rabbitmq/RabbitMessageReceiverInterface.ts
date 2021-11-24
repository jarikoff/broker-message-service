import { ConsumeMessage } from 'amqplib/properties';

export interface RabbitMessageReceiverInterface {
    receiveMessage(message: ConsumeMessage | null): Promise<void>;
}
