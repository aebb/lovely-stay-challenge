import { program } from './command/controller';

async function main() {
  console.log(process.argv);
  program.parse(process.argv);
}
main();
