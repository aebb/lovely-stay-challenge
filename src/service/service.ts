import CreateUser from '../model/request/create.user.type';
import ListUser from '../model/request/list.user.type';
import {
  getUserByNameRemote, getUserByNameLocal, persistUserLocal, listLocal,
} from '../dependencies';
import { ErrorMessage } from '../utils/error.message';

export const findAll = async (request: ListUser): Promise<any> => listLocal(request);

export const create = async (request: CreateUser): Promise<any> => {
  const user = await getUserByNameLocal(request.username);
  if (user) {
    throw new Error(ErrorMessage.userFound);
  }

  const gitUser = await getUserByNameRemote(request.username);

  await persistUserLocal(gitUser);

  return gitUser;
};
