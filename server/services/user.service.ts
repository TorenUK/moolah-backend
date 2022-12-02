import UserModel, {User} from '@model/user.model'

export const createUserService = (input: Partial<User>) =>
  UserModel.create(input)
