import * as FastestValidator from 'fastest-validator';
import { ErrorCodes } from '../errors/ErrorCodes';
import { InternalError } from '../errors/InternalError';
import { BaseService } from '../services/BaseService';
import { RequestValidationSchema } from './types/RequestValidationSchema';
import { Validatable } from './types/Validatable';
import { ValidatorInterface } from './ValidatorInterface';

// Check it out: https://github.com/icebob/fastest-validator
export class ValidatorService extends BaseService implements ValidatorInterface {
    // @ts-ignore
    private validator = new FastestValidator();

    public validate(validatable: Validatable, schema: RequestValidationSchema) {
        const compile = this.validator.compile(schema);
        const validationResult = compile(validatable);

        if (Array.isArray(validationResult) && 'field' in validationResult[0]) {
            const messages = validationResult.map(entry => entry.message || '');
            throw new InternalError(`${ this.constructor.name }`, ErrorCodes.MissingRequiredParams, `${ messages.join() }`);
        }
    }
}
