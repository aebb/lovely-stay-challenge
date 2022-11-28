import *  as repository from  '../../../src/repository/user.remote.rest.repository';

describe('repository', () => {
    it('get user',  async() => {
        const mock = jest.fn();
        mock.mockResolvedValueOnce({data: {location: 'foo-bar'}})
            .mockResolvedValueOnce({data: [{}]})

        const database = {
            handler: {
                request: mock
            },
            configs: {}
        };

        const user = await repository.getUserByName(database)('name');
        expect(user.username).toBe('name');
        expect(user.location).toBe('foo-bar');
    })
})