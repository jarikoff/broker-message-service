import { NewPayment } from '../../entities/request/client/payment/NewPayment';
import { newPaymentValidationSchema } from '../../entities/validation/payment';
import { ErrorCodes } from '../../errors/ErrorCodes';
import { InternalError } from '../../errors/InternalError';
import { ClientService } from '../../services/client/ClientService';
import { ClientServiceInterface } from '../../services/client/ClientServiceInterface';
import { ServiceManager } from '../../services/ServiceManager';
import { ValidatorInterface } from '../../validator/ValidatorInterface';
import { ValidatorService } from '../../validator/ValidatorService';
import { ProxyServiceInterface } from '../ProxyServiceInterface';

export class BalanceAddProxy implements ProxyServiceInterface {
    async passThrough(payload: NewPayment) {
        try {
            const validator = ServiceManager.getInstance().getService(ValidatorService) as ValidatorInterface;
            await validator.validate(payload, newPaymentValidationSchema);
            const service = ServiceManager.getInstance().getService(ClientService) as ClientServiceInterface;
            await service.pushPayment(payload);
        } catch (err) {
            const internalError = err instanceof InternalError ? err : new InternalError(
                `${ this.constructor.name }`,
                ErrorCodes.UnexpectedError,
                `Request: ${ JSON.stringify(payload) }`,
            );
            internalError.renderError();
        }
    }
}
