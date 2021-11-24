import { Config } from '../../../config/config';
import { BalanceAddProxy } from '../../proxies/client/BalanceAddProxy';
import { NewUserSetProxy } from '../../proxies/client/NewUserSetProxy';
import { Action, AssociativeBuilder } from '../AssociativeBuilder';

export class ClientBuilder implements AssociativeBuilder {
    getActions = (): Action[] => [
        {
            name: 'balance_add',
            proxy: BalanceAddProxy,
            isEnabled: Config.get('proxies.balance_add.enabled'),
        },
        {
            name: 'new_user',
            proxy: NewUserSetProxy,
            isEnabled: Config.get('proxies.new_user.enabled'),
        },
    ];
}
