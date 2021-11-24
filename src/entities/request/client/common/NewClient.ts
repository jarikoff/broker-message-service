export interface NewClient {
    client_id: number;
    email: string;
    vk_id: string;
    firstname: string;
    middlename?: string;
    lastname: string;
}

export interface Client extends NewClient {
    status: string;
    total_price: string | number;
}
