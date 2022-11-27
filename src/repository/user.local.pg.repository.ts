import databaseInterface from './database.interface';
import UserRemote from '../model/entity/user.remote.type';
import UserLocal from '../model/entity/user.local.type';
import ListUser from '../model/request/list.user.type';

const { PreparedStatement } = require('pg-promise');

export const getUserByName = (database: databaseInterface) => async (username: string): Promise<UserLocal> => database.handler.oneOrNone(new PreparedStatement(
  {
    name: 'find-user-by-name',
    text: 'SELECT * FROM users WHERE name = ($1)',
    values: [username],
  },
));

export const getUsers = (database: databaseInterface) => async (filters: ListUser): Promise<UserRemote[]> => {
  let query = 'SELECT DISTINCT users.name, locations.name as location, array_agg(languages.name) as languages '
        + 'FROM users '
        + 'LEFT JOIN locations '
        + 'ON users.location_id = locations.id '
        + 'LEFT JOIN user_languages '
        + 'ON users.id = user_languages.user_id '
        + 'LEFT JOIN languages '
        + 'ON user_languages.language_id = languages.id '
        + 'WHERE true '; // chain filters 0, 1 and 1+

  if (filters.location) {
    query += database.configs.as.format(
      'AND locations.name = $/location/ ',
      { location: filters.location },
    );
  }

  if (filters.languages) {
    query += database.configs.as.format(
      'AND languages.name IN ($/languages:csv/)',
      { languages: filters.languages },
    );
  }

  query += database.configs.as.format(
    'GROUP BY users.id, locations.name LIMIT $/limit/ OFFSET $/offset/ ',
    {
      limit: filters.limit,
      offset: filters.offset,
    },
  );

  return database.handler.any(new PreparedStatement(
    {
      name: 'list-all-users-with-filters',
      text: query,
    },
  ));
};

export const persist = (database: databaseInterface) => async (user: UserRemote): Promise<UserRemote> => {
  let locationId = null;

  if (user.location) {
    locationId = await getLocationId(database, user.location);
  }


  const userId = await database.handler.one({
    name: 'persist-user',
    text: 'INSERT INTO users(name, location_id) VALUES ($1, $2) RETURNING id',
    values: [user.username, locationId],
  }).then(userId => userId.id);


  if (user.languages.length > 0 ) {
    const languagesIds = await getLanguagesIds(database, user.languages);
    await persistUserLanguages(database, userId, languagesIds);
  }

  return user;
};

const persistUserLanguages = async (database: databaseInterface, userId: number, languagesIds: number[]): Promise<void> => {
  const columnSet = new database.configs.helpers.ColumnSet(['language_id', 'user_id'], { table: 'user_languages' });
  const values = languagesIds.map((element) => ({ language_id: element, user_id: userId }));
  const query = database.configs.helpers.insert(values, columnSet) + 'ON CONFLICT DO NOTHING';

  return database.handler.none(new PreparedStatement({
    name: 'persist-user-languages',
    text: query,
  }));
};

const getLocationId = async (database: databaseInterface, location: string): Promise<number> => {
  let locationId = await database.handler.oneOrNone(new PreparedStatement(
    {
      name: 'find-location-id',
      text: 'SELECT id FROM locations WHERE name = ($1)',
      values: [location],
    },
  ));

  if (!locationId) {
    locationId = await database.handler.one(new PreparedStatement(
      {
        name: 'persist-location',
        text: 'INSERT INTO locations(name) VALUES ($1) RETURNING id',
        values: [location],
      },
    ));
  }

  return locationId.id;
};

const getLanguagesIds = async (database: databaseInterface, languages: string[]): Promise<number[]> => {
  const columnSet = new database.configs.helpers.ColumnSet(['name'], { table: 'languages' });
  const values = languages.map((element) => ({ name: element }));
  const query1 = database.configs.helpers.insert(values, columnSet) + 'ON CONFLICT DO NOTHING';

  await database.handler.none(new PreparedStatement({
    name: 'persist-languages-ids',
    text: query1,
  }));

  const query2 = database.configs.as.format(
    'SELECT id FROM languages WHERE name IN ($/languages:csv/)',
    { languages },
  );

  const locationIds = await database.handler.many(new PreparedStatement({
    name: 'get-locations-id',
    text: query2,
  }));

  return locationIds.map((element) => element.id);
};
