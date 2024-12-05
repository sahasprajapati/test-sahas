import { ActionsEnum } from '@/enums/action';
import { Config, Role, User } from '@/payload-types';
import type { Access } from 'payload/config';

export const permissionAccessChecker: (
  subject: keyof Config['collections'],
  action: ActionsEnum,
) => Access =
  (subject, action) =>
    ({ req: { user } }) => {
      if (!user)
        return false;
      //@ts-ignore
      return checkUserPermission(user, subject, action);
    }

export const checkUserPermission = (
  user: User,
  subject: keyof Config['collections'],
  action: ActionsEnum,
): boolean => {
  if (user?.roles?.some((role) => {
    if (typeof role === 'object') {
      return role.permissions?.some((permission: any) => {
        return permission.subject === subject && (permission[action] ?? false);
      })
    }
  })) {
    return true;
  }
  return false;
};

export const checkIsAdmin = (user: User): boolean => {
  return user?.roles?.some((role) => {
    if (typeof role === 'object') {
      return role?.isAdmin ?? false
    }
  }) ?? false
}
