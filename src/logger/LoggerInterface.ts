export interface LoggerInterface {
    debug(msg: string): void;
    error(msg: string, err: Error): void;
    warning(msg: string): void;
    info(msg: string): void;
}
