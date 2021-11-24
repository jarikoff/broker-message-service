export interface NewPayment {
    client_id: number;
    id: number;
    city_id: number;
    date: number;
    method: number;
    action: string;
    source: string;
    summ: string | number;
}
