/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Service } from "./service"

  const token= null
  const userName= null
  const userMail= null
  const cmsId= null
  const userId= null
  const cmsUser= false
  const pageIndex= 1
  const currentUser= null
  const password= null
  const page= {}

  const checkUser=(urlParams:any)=> {
    return new Promise((resolve, reject) => {
      let options = {
        cmsId: urlParams.cmsId || cmsId,
        pageIndex: urlParams.pageIndex || pageIndex,
        cmsUser: urlParams.cmsUser || cmsUser,
        userId: urlParams.userId || userId,
        userName: urlParams.userName || userName,
        userMail: urlParams.userMail || userMail
      }
      Service.checkUser(options).then((response:any) => {
        resolve(response.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  const connectWithToken=(urlParams:any)=> {
    return new Promise((resolve, reject) => {
      Service.connectWithToken({
        token: urlParams.token || token
      }).then((response:any) => {
        resolve(response.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }



