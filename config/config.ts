import * as config from 'config';
import { Logger } from "../src/logger/logger";

export class Config {
    private static logger: Logger = new Logger(Config.name);

    public static get(alias: string): any {
        try {
            this.logger.debug(`Trying to fetch value: ${alias}`);
            return config.get(alias);
        }
        catch (err) {
            this.logger.info(err);
        }
    }
}
