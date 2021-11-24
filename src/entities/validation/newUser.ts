import { RequestValidationSchema } from '../../validator/types/RequestValidationSchema';
import { NewClient } from '../request/client/common/NewClient';

export const newClientValidationSchema: RequestValidationSchema<NewClient> = {
    client_id: {
        type: 'number',
        positive: true,
    },
    middlename: {
        type: 'string',
        empty: true,
        nullable: true,
    },
    email: {
        type: 'string',
        nullable: false,
        min: 3,
    },
    firstname: {
        type: 'string',
        nullable: false,
        empty: false,
    },
    lastname: {
        type: 'string',
        nullable: false,
        empty: false,
    },
    vk_id: {
        type: 'string',
        nullable: false
    }
};
