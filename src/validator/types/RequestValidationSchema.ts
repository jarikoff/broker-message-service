import { ValidationRuleObject } from 'fastest-validator';

export type RequestValidationSchema<T = any> = {
    [key in keyof T]: ValidationRuleObject
};
