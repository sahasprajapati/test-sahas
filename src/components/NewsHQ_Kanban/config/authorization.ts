/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Service } from "../services/service"


export const login=(authUser:any)=> {
    return new Promise((resolve, reject) => {
      let options:any = {
        userName: authUser.userName,
        userMail: authUser.userMail,
        password: authUser.password
      }
      Service.login(options).then((response:any) => {
        resolve(response.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }

export const   connectWithToken=(urlParams:any) =>{
    return new Promise((resolve, reject) => {
      Service.connectWithToken({
        token: urlParams.token
      }).then((response:any) => {
        resolve(response.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }