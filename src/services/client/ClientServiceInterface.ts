import { NewClient } from '../../entities/request/client/common/NewClient';
import { NewPayment } from '../../entities/request/client/payment/NewPayment';
import { BaseServiceInterface } from '../BaseServiceInterface';

export interface ClientServiceInterface extends BaseServiceInterface {
    pushPayment(payload: NewPayment): Promise<boolean>;
    handleNewClient(payload: NewClient): Promise<boolean>;
}
