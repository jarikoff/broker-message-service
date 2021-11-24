import { ProxyServiceInterface } from '../proxies/ProxyServiceInterface';

export interface ActionBuilderInterface {
    getProxyService(action: string): ProxyServiceInterface | null;
}
