import newrelic from 'newrelic';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

const loggerClient = createLogger({
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
});

export function logger(error, data) {
  try {
    const errorMessage = error?.message;
    const statusCode = Number(error?.response?.status);

    if (statusCode >= 400 && statusCode < 500) {
      loggerClient.warn(errorMessage, { data });
    } else if (statusCode >= 500) {
      loggerClient.error(errorMessage, { data });
    }
  } catch (error) {
    console.error(error);
  }
}

// DEPRECATED
export function log(error) {
  // console.log(error)
  return null;
}

export function newrelicErrorLogging(e) {
  newrelic.noticeError(e);
}
