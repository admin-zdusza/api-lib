import { createLogger, logError, logInfo, logStorableEvent } from "../../../src";

let logger = null;
let originalInfo = null;
let originalError = null;

beforeAll(() => {
  logger = createLogger('test');
  originalInfo = logger.info;
  originalError = logger.error;
  logger.info = jest.fn();
  logger.error = jest.fn();
});

afterAll(() => {
  logger.info = originalInfo;
  logger.error = originalError;
});

test("should log", async () => {
  logStorableEvent('test');
  logInfo({test: 'test'});
  logError(new Error('Error'));
  expect(logger.info).toHaveBeenCalledTimes(2);
  expect(logger.error).toHaveBeenCalled();
});
