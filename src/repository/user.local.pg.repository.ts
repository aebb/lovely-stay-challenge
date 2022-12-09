import Database from './database.interface';
import UserRemote from '../model/entity/user.remote.type';
import UserLocal from '../model/entity/user.local.type';
import ListUser from '../model/request/list.user.type';

const { PreparedStatement } = require('pg-promise');

export const getUserByName = (database: Database) => async (username: string): Promise<UserLocal> => {
  const query = database.configs.as.format(
    'SELECT * FROM users WHERE name = $/name/',
    { name: username },
  );

  return database.handler.oneOrNone(new PreparedStatement(
    {
      name: 'find-user-by-name',
      text: query,
    },
  ));
};

export const getUsers = (database: Database) => async (filters: ListUser): Promise<UserRemote[]> => {
  let query = 'SELECT DISTINCT '
        + 'users.name, '
        + 'locations.name as location, '
        + 'array_agg(languages.name) as languages '
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
      'AND languages.name IN ($/languages:csv/) ',
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

const persistUserLanguages = async (database: Database, userId: number, languagesIds: number[]): Promise<void> => {
  const columnSet = new database.configs.helpers.ColumnSet(
    ['language_id', 'user_id'],
    { table: 'user_languages' },
  );

  const values = languagesIds.map(
    (element) => ({ language_id: element, user_id: userId }),
  );

  const query = database.configs.helpers.insert(values, columnSet)
    + ' ON CONFLICT DO NOTHING';

  return database.handler.none(new PreparedStatement({
    name: 'persist-user-languages',
    text: query,
  }));
};

const obtainLocationId = async (database: Database, location: string): Promise<number> => {
  const query = database.configs.as.format(
    'SELECT id FROM locations WHERE name = $/name/',
    { name: location },
  );

  let locationId = await database.handler.oneOrNone(new PreparedStatement(
    {
      name: 'find-location-id',
      text: query,
    },
  ));

  if (!locationId) {
    const query2 = database.configs.helpers.insert(
      { name: location },
      null,
      'locations',
    ) + ' RETURNING id';

    locationId = await database.handler.one(new PreparedStatement(
      {
        name: 'persist-location',
        text: query2,
      },
    ));
  }

  return locationId.id;
};

const obtainLanguageIds = async (database: Database, languages: string[]): Promise<number[]> => {
  const columnSet = new database.configs.helpers.ColumnSet(
    ['name'],
    { table: 'languages' },
  );

  const values = languages.map(
    (element) => ({ name: element }),
  );

  const query1 = database.configs.helpers.insert(values, columnSet)
      + 'ON CONFLICT DO NOTHING';

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

export const persist = (database: Database) => async (user: UserRemote): Promise<UserRemote> => {
  let locationId = null;

  if (user.location) {
    locationId = await obtainLocationId(database, user.location);
  }

  const query = database.configs.helpers.insert(
    { name: user.username, location_id: locationId },
    null,
    'users',
  ) + ' RETURNING id';

  const userId = await database.handler.one({
    name: 'persist-user',
    text: query,
  }).then((result) => result.id);

  if (user.languages.length > 0) {
    const languagesIds = await obtainLanguageIds(database, user.languages);
    await persistUserLanguages(database, userId, languagesIds);
  }

  return user;
};
