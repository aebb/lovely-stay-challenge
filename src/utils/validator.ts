import { InvalidArgumentError } from 'commander';
import { ErrorMessage } from './error.message';

const config = require('config');

const max = config.get('database.local.limit');

const validateNumber = (value: string, previous: string): number => {
  const parsedValue = parseInt(value, 10);

  if (Number.isNaN(parsedValue)) {
    throw new InvalidArgumentError(ErrorMessage.notNumber);
  }

  if (parsedValue < 0) {
    throw new InvalidArgumentError(ErrorMessage.notPositive);
  }

  return parsedValue;
};

export const validateWithMax = (value: string, previous: string): string => {
  const parsedValue = validateNumber(value, previous);

  if (parsedValue > max) {
    throw new InvalidArgumentError(ErrorMessage.limit + max);
  }

  return String(parsedValue);
};

export const validate = (value: string, previous: string): string => String(validateNumber(value, previous));
