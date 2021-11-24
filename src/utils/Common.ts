export const toBoolean = (value: string | number | boolean): boolean =>
    [ true, 'true', 'True', 'TRUE', '1', 1 ].includes(value);
