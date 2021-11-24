import { Constructor } from 'awilix';
import { ProxyServiceInterface } from '../proxies/ProxyServiceInterface';

export interface Action {
    name: string;
    proxy: Constructor<ProxyServiceInterface>;
    isEnabled: boolean;
}

export interface AssociativeBuilder {
    getActions(): Action[];
}
