import { Command } from 'commander';
import { create, findAll } from '../service/service';
import ListUser from '../model/request/list.user.type';
import CreateUser from '../model/request/create.user.type';
import { validate, validateWithMax } from '../utils/validator';
import { modules } from '../dependencies';

export const program = new Command();

program
  .name('lovely-stay-cli')
  .description('lovely stay challenge')
  .version('1.0.0');

program.command('create')
  .description('Create an user based on data from github')
  .requiredOption('-u, --username <string>', 'github username')
  .action((request: CreateUser) => {
    create(request)
    // better logging but harder to read
    // .then((result) => modules.logger.info(result))
      .then((result) => console.log(result))
      .catch((error) => modules.logger.error(error.message))
      .finally(() => modules.close());
  });

program.command('list')
  .description('List all users stored locally')
  .option('-lc, --location <string>', 'user location')
  .option('-lg, --languages <string...>', 'user languages')
  .option('-l, --limit <number>', 'limit', validateWithMax, '50')
  .option('-o, --offset <number>', 'offset', validate, '0')
  .action((request: ListUser) => {
    findAll(request)
    // better logging but harder to read
    // .then((result) => modules.logger.info(result))
      .then((result) => console.log(result))
      .catch((error) => modules.logger.error(error.message))
      .finally(() => modules.close());
  });
