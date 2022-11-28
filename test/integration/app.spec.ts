import { program } from  '../../src/command/controller';

describe('AppController', () => {
    beforeEach(async () => {
        program.exitOverride();
        program.configureOutput({
            writeOut: () => {},
            writeErr: () => {}
        });
    });

    it('list', async () => {
        program.parse([
            '/app/node_modules/.bin/ts-node',
            '/app/src/main.ts',
            'list',
            '--location',
            'France',
            '--languages',
            'PHP',
            '--limit',
            '1',
            '--offset',
            '10'
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

    it('list error', async () => {
        const mockExit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

        expect(() => {
            program.parse([
                '/app/node_modules/.bin/ts-node',
                '/app/src/main.ts',
                'list',
                '--limit',
                '123'
            ]);
        }).toThrow();

        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
    })

    it('create error', async () => {
        const mockExit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

        expect(() => {
            program.parse([
                '/app/node_modules/.bin/ts-node',
                '/app/src/main.ts',
                'create',
                '--aebb'
            ]);
        }).toThrow();
        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
    })
})