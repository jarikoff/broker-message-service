import { BaseServiceInterface } from '../services/BaseServiceInterface';
import { RequestValidationSchema } from './types/RequestValidationSchema';
import { Validatable } from './types/Validatable';

export interface ValidatorInterface extends BaseServiceInterface {
    validate(validatable: Validatable, schema: RequestValidationSchema);
}
