import bunyan, { default as Logger } from "bunyan";

let logger = null;

const createLogger = (name: string): Logger => {
  logger = bunyan.createLogger({ name });
  /* eslint-disable no-underscore-dangle, no-param-reassign, no-underscore-dangle */
  logger._emit = (rec, noemit) => {
    delete rec.hostname;
    delete rec.pid;
    delete rec.v;
    delete rec.name;
    delete rec.time;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    bunyan.prototype._emit.call(logger, rec, noemit);
  };
  return logger;
  /* eslint-enable no-underscore-dangle, no-param-reassign, no-underscore-dangle */
};

const logStorableEvent = (line: string): void => {
  logger.info(line);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logInfo = (event: Record<string, any>): void => {
  logger.info({ logEvent: event });
};

const logError = (err: Error): void => {
  logger.error(err);
};

export { createLogger, logStorableEvent, logInfo, logError };
