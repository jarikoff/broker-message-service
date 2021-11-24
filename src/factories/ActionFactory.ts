import { Logger } from '../logger/logger';
import { ProxyServiceInterface } from '../proxies/ProxyServiceInterface';
import { toBoolean } from '../utils/Common';
import { ActionBuilderInterface } from './ActionBuilderInterface';
import { AssociativeBuilder } from './AssociativeBuilder';

export class ActionFactory implements ActionBuilderInterface {
    protected association = new Map<string, ProxyServiceInterface>();
    private logger: Logger = new Logger(`${ this.constructor.name }`);

    constructor(builder: AssociativeBuilder) {
        builder.getActions().forEach(action => toBoolean(action.isEnabled) ? this.association.set(action.name, new action.proxy()) : null);
    }

    getProxyService(action: string): ProxyServiceInterface | null {
        if (this.association.has(action)) {
            return this.association.get(action);
        }

        this.logger.warning(`Action: ${ action } did not match any association.`);
        return null;
    }
}
