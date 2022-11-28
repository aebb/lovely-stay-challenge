import { program } from './command/controller';

async function main() {
  program.parse(process.argv);
}
main();
