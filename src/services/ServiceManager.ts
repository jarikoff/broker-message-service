import * as awilix from 'awilix';
import { Constructor } from 'awilix';
import { ErrorCodes } from '../errors/ErrorCodes';
import { InternalError } from '../errors/InternalError';
import { Logger } from '../logger/logger';
import { ValidatorService } from '../validator/ValidatorService';
import { ClientService } from './client/ClientService';
import { BaseServiceInterface } from './BaseServiceInterface';

export class ServiceManager {
    private static instance: ServiceManager;
    private container: awilix.AwilixContainer;
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
        this.initServicesList();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new ServiceManager();
        }
        return this.instance;
    }

    public getService<T extends BaseServiceInterface>(name: string | Constructor<T>): T | undefined {
        if (typeof name === 'function') {
            if (name.name === undefined) {
                throw new InternalError(this.constructor.name, ErrorCodes.UnexpectedError, 'Can\'t resolve service with non-constructor function');
            }

            name = name.name;
        }

        return this.container.resolve<T>(name.toString());
    }

    private initServicesList() {
        this.container = awilix.createContainer({
            injectionMode: awilix.InjectionMode.PROXY,
        });

        this.container.register({
            ClientService: awilix.asClass(ClientService).singleton(),
        });

        this.container.register({
            ValidatorService: awilix.asClass(ValidatorService).singleton(),
        })
    }
}
