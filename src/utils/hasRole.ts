import type { Access } from 'payload/types'

export function hasRole<T = any>(role: string, allRoles: string[]): Access<T> {
  return async ({ req, id, data }) => {
    const user: any = req.user

    const userRole: string = user?.role as any;
    if (userRole === role) return true

    if (allRoles.indexOf(userRole) >= allRoles.indexOf(role)) return true
    return false
  }
}
