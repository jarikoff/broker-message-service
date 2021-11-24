import { Logger } from '../logger/logger';
import { BaseServiceInterface } from './BaseServiceInterface';

export abstract class BaseService implements BaseServiceInterface {
    protected readonly logger: Logger;

    constructor() {
        this.logger = new Logger(this.getLoggerTag());
    }

    public getLoggerTag(): string {
        return this.constructor.name;
    }
}
