import { checkIsAdmin, checkUserPermission } from '@/access/admin'
import { ActionsEnum } from '@/enums/action'
import { Config } from '@/payload-types'
import { Access } from 'payload/config'

export const adminAndSelfPermissionAccessChecker: (
  subject: keyof Config['collections'],
  action: ActionsEnum,
) => Access =
  (subject, action) =>
    ({ req: { user } }) => {
      //@ts-ignore
      if (user && checkUserPermission(user, subject, action)) {
        // Only if admin has permission give access, Otherwise only give access to the article author
        //@ts-ignore
        if (checkIsAdmin(user)) {
          return true
        }

        return {
          id: {
            equals: user?.id,
          },
        }
      }
      return false
    }
