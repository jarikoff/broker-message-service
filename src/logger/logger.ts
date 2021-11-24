import * as stackTraceParser from 'stacktrace-parser';
import * as winston from 'winston';
import { LoggerInterface } from './LoggerInterface';

export class Logger implements LoggerInterface {
    private logger: winston.Logger;
    private readonly tag: string;
    private readonly maxTraceLength: number;

    constructor(tag: string, maxTraceLength?: number) {
        this.tag = tag;

        this.logger = winston.createLogger({
            transports: [
                new (winston.transports.Console)({
                    level: process.env.LOG_LEVEL,
                    silent: (process.env.LOG_LEVEL === 'silent'),
                }),
            ],
        });

        this.maxTraceLength = maxTraceLength ?? Number(process.env.MAX_LOG_TRACE);
    }

    public debug(msg: string): void {
        this.logger.log({
            level: 'debug',
            message: `${ new Date() } [${ this.tag }]: ${ msg }`,
        });
    }

    public error(msg: string, err: Error): void {
        this.logger.log({
            level: 'error',
            message: `${ new Date() } [${ this.tag }]: ${ msg }`,
            trace: stackTraceParser.parse(err.stack)
                .map(st => ({
                    file: st.file,
                    column: st.column,
                    line: st.lineNumber,
                    method: st.methodName,
                }))
                ?.slice(0, this.maxTraceLength),
        });
    }

    public info(msg: string): void {
        this.logger.log({
            level: 'info',
            message: `${ new Date() } [${ this.tag }]: ${ msg }`,
        });
    }

    public warning(msg: string): void {
        this.logger.log({
            level: 'warn',
            message: `${ new Date() } [${ this.tag }]: ${ msg }`,
        });
    }
}
