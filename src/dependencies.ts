import { Octokit } from 'octokit';
import * as UserRemote from './repository/user.remote.rest.repository';
import * as UserLocal from './repository/user.local.pg.repository';
import * as pgPromise from 'pg-promise';
import * as winston from "winston";
const config = require('config');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
      winston.format.prettyPrint(),
      winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export let modules = {
  github: {},
  githubConfigs: {},
  database: {},
  databaseConfigs: {},
  close: () => {},
  logger: logger,
};

switch (process.env.NODE_ENV) {
  case 'test': {
    break;
  }
  default: {
    const pgp = pgPromise({});
    modules = {
      github: new Octokit(),
      githubConfigs: {},
      database: pgp(config.get('database.local.url')),
      databaseConfigs: pgp,
      close: () => pgp.end(),
      logger: logger,
  };
    break;
  }
}

export const getUserByNameRemote = UserRemote.getUserByName({
  handler: modules.github,
  configs: modules.githubConfigs,
});

export const getUserByNameLocal = UserLocal.getUserByName({
  handler: modules.database,
  configs: modules.databaseConfigs,
});

export const persistUserLocal = UserLocal.persist({
  handler: modules.database,
  configs: modules.databaseConfigs,
});

export const listLocal = UserLocal.getUsers({
  handler: modules.database,
  configs: modules.databaseConfigs,
});
