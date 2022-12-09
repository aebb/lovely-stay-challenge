import databaseInterface from './database.interface';
import UserRemote from '../model/entity/user.remote.type';

const filterUserLanguages = (result: any): string[] => {
  const repositories = Object.values(result.data);

  let languages = repositories.map((element: any) => element.language);

  languages = languages.filter((element) => element);

  const uniqueLanguages = new Set(languages);

  return Array.from(uniqueLanguages.keys());
};

export const getUserByName = (database: databaseInterface) => async (username: string): Promise<UserRemote> => {
  const githubUser = await database.handler.request(
    'GET /users/{username}',
    { username },
  );

  const repositoriesData = await database.handler.request(
    'GET /users/{username}/repos',
    { username },
  );

  const languages = filterUserLanguages(repositoriesData);

  return {
    username,
    location: githubUser.data.location,
    languages,
  };
};
