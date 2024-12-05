import { combineReducers } from '@reduxjs/toolkit'
import { reducer as login } from '../slices/logIn'

export const rootReducer = combineReducers({
  login: login,
})
