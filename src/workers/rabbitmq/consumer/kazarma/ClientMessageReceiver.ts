import { ConsumeMessage } from 'amqplib/properties';
import { RabbitMessageReceiver } from '../../../../rabbitmq/RabbitMessageReceiver';
import { RabbitMessageReceiverInterface } from '../../../../rabbitmq/RabbitMessageReceiverInterface';

interface KazarmaMessage {
    system: string;
    payload: KazarmaActionData;
}

interface KazarmaActionData {
    action: string;
}

export class ClientMessageReceiver extends RabbitMessageReceiver implements RabbitMessageReceiverInterface {
    async receiveMessage(message: ConsumeMessage | null): Promise<void> {
        if (message) {
            const content = JSON.parse(message.content.toString()) as KazarmaMessage;
            const payload = content.payload as KazarmaActionData;
            const proxy = this.builder.getProxyService(payload.action);
            await proxy?.passThrough(content.payload);
        }
    }
}
