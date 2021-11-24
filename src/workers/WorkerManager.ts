import { Constructor } from 'awilix';
import { ClientConsumer } from './rabbitmq/consumer/kazarma/ClientConsumer';
import { WorkerInterface } from './WorkerInterface';

export class WorkerManager {
    protected workers: Constructor<WorkerInterface>[] = [
        ClientConsumer,
    ];

    private static instance: WorkerManager = null;
    protected instances = new Map<string, WorkerInterface>();

    static getInstance() {
        if (!this.instance) {
            this.instance = new WorkerManager();
        }
        return this.instance;
    }

    public initWorkers() {
        this.workers.forEach(async (cls: Constructor<WorkerInterface>) => {
            const instance = new cls();
            await instance.start();
            this.instances.set(cls.name, instance);
        });
    }
}
