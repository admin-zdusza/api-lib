import bunyan from "bunyan";

let logger = null;

const createLogger = (name: string) => {
  logger = bunyan.createLogger({name});
  /* eslint-disable no-underscore-dangle, no-param-reassign, no-underscore-dangle */
  logger._emit = (rec, noemit) => {
    delete rec.hostname;
    delete rec.pid;
    delete rec.v;
    delete rec.name;
    delete rec.time;
    bunyan.prototype._emit.call(logger, rec, noemit);
  };
  /* eslint-enable no-underscore-dangle, no-param-reassign, no-underscore-dangle */
};


const logStorableEvent = (line) => {
  logger.info(line);
};

const logInfo = (event) => {
  logger.info({logEvent: event});
};

const logError = (err) => {
  logger.error(err);
};

export { createLogger, logStorableEvent, logInfo, logError };
