import { Logger } from '../logger/logger';
import { ErrorCodes } from './ErrorCodes';
import { ErrorDescription } from './ErrorDescription';

export class ErrorManager {
    protected static readonly logger: Logger = new Logger(`ErrorManager`);

    private static values: { [key in ErrorCodes]: ErrorDescription } = {
        [ErrorCodes.UnexpectedError]: {
            sendToSentry: true,
            uiMessage: 'Произошла ошибка. Попробуйте выполнить действие снова или обратитесь в поддержку.',
            logMessage: 'Unexpected Error.',
            description: 'Необработанная ошибка, ошибка внутри кода фасадного API.',
        },
        [ErrorCodes.MissingRequiredParams]: {
            sendToSentry: true,
            uiMessage: 'Невозможно выполнить операцию',
            logMessage: 'BadRequest, missing required params.',
            description: 'В метод не переданы обязательные параметры',
        },
        [ErrorCodes.RABBIT_CONNECTION_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t connect to rabbit following provided config.',
            description: 'По какой-то причине не удается подключиться к кролику. Проверьте конфиг.',
        },
        [ErrorCodes.RABBIT_CREATE_CHANNEL_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t create a rabbit channel.',
            description: 'По какой-то причине не удается подключиться к кролику. Проверьте конфиг.',
        },
        [ErrorCodes.RABBIT_ASSERT_EXCHANGE_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t assert an exchange.',
            description: 'По какой-то причине не удается подключиться к кролику. Проверьте конфиг.',
        },
        [ErrorCodes.RABBIT_ASSERT_QUEUE_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t assert a queue.',
            description: 'По какой-то причине не удается подключиться к кролику. Проверьте конфиг.',
        },
        [ErrorCodes.RABBIT_BIND_QUEUE_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t bind a queue.',
            description: 'По какой-то причине не удается подключиться к кролику. Проверьте конфиг.',
        },
        [ErrorCodes.RABBIT_CONSUME_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t consume messages. Check rabbit connection.',
            description: 'По какой-то причине не удается подключиться к кролику. Проверьте конфиг.',
        },
        [ErrorCodes.RABBIT_RECONNECT_FAILED]: {
            sendToSentry: true,
            logMessage: 'Rabbit. Can`t reconnect to rabbit. Failed few times.',
            description: 'Не удалось реконнектнуться к кролику несколько раз. Проверьте жив ли он и конфиг подключения.',
        },
    };

    public static getErrorDescription(code: ErrorCodes, techInfo: string = ''): ErrorDescription {
        try {
            const storedErrorDescription = this.values[code];

            const errorDescription = Object.assign(new ErrorDescription(), storedErrorDescription);

            errorDescription.logMessage = `${ code }. ${ errorDescription.logMessage }. ${ techInfo ? 'Details: ' + techInfo : '' }`;
            errorDescription.uiMessage = `${ code }. ${ errorDescription.uiMessage }`;

            return errorDescription;
        } catch (err) {
            this.logger.error(`Cannot get error description with code ${ code }.`, err);
            return this.values[ErrorCodes.UnexpectedError];
        }
    }
}
