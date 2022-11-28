import *  as repository from  '../../../src/repository/user.local.pg.repository';

describe('repository', () => {

    it('get user by name',  async() => {

        const mock = jest.fn();
        mock.mockResolvedValueOnce({username: 'name'})

        const database = {
            handler: {
                oneOrNone: mock
            },
            configs: {}
        };

        const user = await repository.getUserByName(database)('name');
        expect(user.username).toBe('name');
    })

    it('get users',  async() => {

        const mockHandler = jest.fn();
        const mockConfigs = jest.fn();

        mockHandler.mockResolvedValueOnce([]);
        mockConfigs.mockResolvedValue('');

        const database = {
            handler: {
                any: mockHandler
            },
            configs: {
                as: {
                    format: mockConfigs
                }
            }
        };

        const filters = {
            limit: 1,
            offset: 1,
            location: 'somewhere',
            languages: ['PHP']

        };

        const users = await repository.getUsers(database)(filters);
        expect(users.length).toBe(0);
    })

    it('persist user',  async() => {
        const mockOneOrNone = jest.fn();
        const mockOne = jest.fn();

        const locationId = {id:1};

        mockOneOrNone.mockResolvedValueOnce(null);
        mockOne.mockResolvedValueOnce(locationId);
        mockOne.mockResolvedValueOnce(locationId);

        const database = {
            handler: {
                oneOrNone: mockOneOrNone,
                one: mockOne,
            },
            configs: {
            }
        };

        const user = {
            'username': '123',
            'location': 'foo-bar',
            'languages': []
        };

        const userRemote = await repository.persist(database)(user);
        expect(userRemote).toBe(user);
    })

})