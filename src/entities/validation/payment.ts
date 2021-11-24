import { RequestValidationSchema } from '../../validator/types/RequestValidationSchema';
import { NewPayment } from '../request/client/payment/NewPayment';

export const newPaymentValidationSchema: RequestValidationSchema<NewPayment> = {
    client_id: {
        type: 'number',
        positive: true,
    },
    id: {
        type: 'number',
        positive: true,
    },
    city_id: {
        type: 'number',
        positive: true,
    },
    date: {
        type: 'number',
        positive: true,
    },
    method: {
        type: 'number',
        positive: true,
    },
    action: {
        type: 'string',
        empty: false,
    },
    source: {
        type: 'string',
        empty: false,
    },
    summ: {
        type: 'any',
    },
};
