import CreateUser from '../model/request/create.user.type';
import ListUser from '../model/request/list.user.type';
import {
  getUserByNameRemote, getUserByNameLocal, persistUserLocal, listLocal,
} from '../dependencies';
import { ErrorMessage } from '../utils/error.message';
import UserRemote from '../model/entity/user.remote.type';

export const findAll = async (request: ListUser): Promise<UserRemote[]> => listLocal(request);

export const create = async (request: CreateUser): Promise<UserRemote> => {
  const user = await getUserByNameLocal(request.username);
  if (user) {
    throw new Error(ErrorMessage.userFound);
  }

  const gitUser = await getUserByNameRemote(request.username);

  await persistUserLocal(gitUser);

  return gitUser;
};
