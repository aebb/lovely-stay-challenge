import { program } from  '../../src/command/controller';

describe('AppController', () => {
    beforeEach(async () => {});

    it('list', async () => {
        program.parse([
            '/app/node_modules/.bin/ts-node',
            '/app/src/main.ts',
            'list'
        ]);
        expect.anything();
    })

    it('create', async () => {
        program.parse([
            '/app/node_modules/.bin/ts-node',
            '/app/src/main.ts',
            'create',
            '-u',
            'aebb'
        ]);
        expect.anything();
    })
})