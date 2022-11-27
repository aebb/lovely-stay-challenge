import databaseInterface from './database.interface';
import UserRemote from '../model/entity/user.remote.type';

export const getUserByName = (database: databaseInterface) => async (username: string): Promise<UserRemote> => {
  const githubUser = await database.handler.request(
    'GET /users/{username}',
    { username },
  );

  const languages = await database.handler.request(
    'GET /users/{username}/repos',
    { username },
  )
    .then((result) => Object.values(result.data))
    .then((result) => result.map((element) => element.language))
    .then((result) => result.filter((element) => element))
    .then((result) => new Set(result))
    .then((result) => Array.from(result.keys()));

  return {
    username,
    location: githubUser.data.location,
    languages,
  };
};
