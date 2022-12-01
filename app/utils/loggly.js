import winston from 'winston';

// require('winston-loggly-bulk');

export const loggly = (type, data) => {
  winston.log(type, data)
}
