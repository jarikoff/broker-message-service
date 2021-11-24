import { RequestValidationSchema } from '../../../entities/services/validator/RequestValidationSchema';
import { Validatable } from '../../../entities/services/validator/Validatable';
import { BaseServiceInterface } from '../../helpers/BaseServiceInterface';

export interface ValidatorInterface extends BaseServiceInterface {
    validate(validatable: Validatable, schema: RequestValidationSchema);
}
