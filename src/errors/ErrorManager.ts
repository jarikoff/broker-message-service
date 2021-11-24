import { Logger } from '../logger/logger';
import { ErrorCodes } from './ErrorCodes';
import { ErrorDescription } from './ErrorDescription';

export class ErrorManager {
    protected static readonly logger: Logger = new Logger(`ErrorManager`);

    private static values: { [key in ErrorCodes]: ErrorDescription } = {
        [ErrorCodes.UnexpectedError]: {
            uiMessage: 'Произошла ошибка. Попробуйте выполнить действие снова или обратитесь в поддержку.',
            logMessage: 'Unexpected Error.',
        },
        [ErrorCodes.MissingRequiredParams]: {
            uiMessage: 'Невозможно выполнить операцию',
            logMessage: 'BadRequest, missing required params.',
        },
        [ErrorCodes.PAYMENT_SUM_MORE_THAT_TOTAL]: {
            uiMessage: 'Произошла ошибка при обработке платежа, обратитесь в техническую поддержку',
            logMessage: 'Received summ is more than total price of contract.',
        },
        [ErrorCodes.RABBIT_CONNECTION_FAILED]: {
            logMessage: 'Rabbit. Can`t connect to rabbit following provided config.',
        },
        [ErrorCodes.RABBIT_CREATE_CHANNEL_FAILED]: {
            logMessage: 'Rabbit. Can`t create a rabbit channel.',
        },
        [ErrorCodes.RABBIT_ASSERT_EXCHANGE_FAILED]: {
            logMessage: 'Rabbit. Can`t assert an exchange.',
        },
        [ErrorCodes.RABBIT_ASSERT_QUEUE_FAILED]: {
            logMessage: 'Rabbit. Can`t assert a queue.',
        },
        [ErrorCodes.RABBIT_BIND_QUEUE_FAILED]: {
            logMessage: 'Rabbit. Can`t bind a queue.',
        },
        [ErrorCodes.RABBIT_CONSUME_FAILED]: {
            logMessage: 'Rabbit. Can`t consume messages. Check rabbit connection.',
        },
        [ErrorCodes.RABBIT_RECONNECT_FAILED]: {
            logMessage: 'Rabbit. Can`t reconnect to rabbit. Failed few times.',
        },
    };

    public static getErrorDescription(code: ErrorCodes, techInfo: string = ''): ErrorDescription {
        try {
            const storedErrorDescription = this.values[code];

            const errorDescription = Object.assign(new ErrorDescription(), storedErrorDescription);

            errorDescription.logMessage = `${ code }. ${ errorDescription.logMessage }. ${ techInfo ? 'Details: ' + techInfo : '' }`;
            errorDescription.uiMessage = errorDescription.uiMessage ? `${ code }. ${ errorDescription.uiMessage }` : `${ code }`;

            return errorDescription;
        } catch (err) {
            this.logger.error(`Cannot get error description with code ${ code }.`, err);
            return this.values[ErrorCodes.UnexpectedError];
        }
    }
}
