import { NewClient } from '../../entities/request/client/common/NewClient';
import { newClientValidationSchema } from '../../entities/validation/newUser';
import { ErrorCodes } from '../../errors/ErrorCodes';
import { InternalError } from '../../errors/InternalError';
import { ClientService } from '../../services/client/ClientService';
import { ClientServiceInterface } from '../../services/client/ClientServiceInterface';
import { ServiceManager } from '../../services/ServiceManager';
import { ValidatorInterface } from '../../validator/ValidatorInterface';
import { ValidatorService } from '../../validator/ValidatorService';
import { ProxyServiceInterface } from '../ProxyServiceInterface';

export class NewUserSetProxy implements ProxyServiceInterface {
    async passThrough(payload: NewClient) {
        try {
            const validator = ServiceManager.getInstance().getService(ValidatorService) as ValidatorInterface;
            await validator.validate(payload, newClientValidationSchema);
            const service = ServiceManager.getInstance().getService(ClientService) as ClientServiceInterface;
            await service.handleNewClient(payload);
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
