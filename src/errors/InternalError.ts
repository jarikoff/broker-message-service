import { Logger } from '../logger/logger';
import { ErrorCodes } from './ErrorCodes';
import { ErrorDescription } from './ErrorDescription';
import { ErrorManager } from './ErrorManager';

export class InternalError extends Error {
    protected readonly logger: Logger;
    public details: string;
    public statusCode: number;
    public errorCode: ErrorCodes;

    constructor(tag: string, errorCode: ErrorCodes, details?: string, statusCode?: number) {
        super('');
        this.errorCode = errorCode;
        this.details = details;
        this.statusCode = statusCode;
        this.logger = new Logger(`${ tag }`);
    }

    public renderError(overriddenErrorCode?: ErrorCodes) {
        const errorDescription = ErrorManager.getErrorDescription(this.errorCode, this.details);
        let uiMessage = errorDescription.uiMessage;

        let overriddenErrorDescription: ErrorDescription = null;
        if (overriddenErrorCode && overriddenErrorCode !== this.errorCode) {
            overriddenErrorDescription = ErrorManager.getErrorDescription(overriddenErrorCode, this.details);
            uiMessage = overriddenErrorDescription.uiMessage;
        }

        this.logger.error(`${ errorDescription.logMessage } ${ overriddenErrorDescription?.logMessage || '' }`, this);
    }
}
