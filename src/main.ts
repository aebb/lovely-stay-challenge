import { program } from './command/controller';

async function main() {
  await program.parseAsync(process.argv);
}
main();
