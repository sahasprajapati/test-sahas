import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';

interface LoginState {
    processing: boolean,
    error: boolean,
    loggedIn: boolean,
    user: any,
}

const initialState: LoginState = {
    processing: false,
    error: false,
    loggedIn: false,
    user: undefined
};

export const slice = createSlice({
    name: "login",
    initialState,
    reducers: {
        loginStatusAction(state: LoginState, action: PayloadAction<{
            processing: boolean,
            error: boolean,
            loggedIn: boolean,
        }>): void {
            state.processing = action.payload.processing;
            state.error = action.payload.error;
            state.loggedIn = action.payload.loggedIn
        },
        userAction(state: LoginState, action: PayloadAction<any>): void {
            state.user = action.payload;
        }
    }
})

export const { reducer } = slice;

export const login = (username: string, password: string): AppThunk => async (dispatch: any): Promise<void> => {


};

export const reAuthentication = (): AppThunk => async (dispatch: any): Promise<void> => {

};
