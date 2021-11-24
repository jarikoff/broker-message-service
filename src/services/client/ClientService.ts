import { Client, NewClient } from '../../entities/request/client/common/NewClient';
import { NewPayment } from '../../entities/request/client/payment/NewPayment';
import { ErrorCodes } from '../../errors/ErrorCodes';
import { InternalError } from '../../errors/InternalError';
import { BaseService } from '../BaseService';
import { ClientServiceInterface } from './ClientServiceInterface';

export class ClientService extends BaseService implements ClientServiceInterface {
    async pushPayment(payload: NewPayment): Promise<boolean> {
        const client = await this.getClient(payload.client_id);
        if (Number(client.total_price) < Number(payload.summ)) {
            throw new InternalError(
                this.getLoggerTag(),
                ErrorCodes.PAYMENT_SUM_MORE_THAT_TOTAL,
                `Total: ${ client.total_price }, payment: ${ payload.summ }`,
            );
        }

        this.logger.info(`Looks good, bring more logic to push notification to mobile app!`);
        return true;
    }

    async handleNewClient(payload: NewClient): Promise<boolean> {
        this.logger.info(`Send a nice welcome email or use bot to write to a client in VK. ${ payload.lastname } ${ payload.firstname } are waiting for us!`);
        return true;
    }

    private getClient(id: number): Promise<Client> {
        return new Promise<Client>((res, rej) => {
            if (id < 5) { // Imitate some bad situations
                rej('Client not found');
            }

            res({
                vk_id: '1234567',
                firstname: 'name',
                lastname: 'lastname',
                email: 'some_test@gmail.com',
                client_id: id,
                total_price: 10_000,
                status: 'open',
            });
        });
    }
}
