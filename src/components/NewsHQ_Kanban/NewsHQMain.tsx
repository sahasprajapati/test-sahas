//@ts-ignore
'use client'
import React from "react";
import { loginUser } from "./hooks/usePageState";
import { Login } from "./login";
import KanbanBoard from "./KanbanBoard";
import { initializeFirebase } from './initializeFirebase'
import { UserData, loginResult } from "./type/kanbanTypes";

export const NewsHQMain = () => {
    const [userData, setUserData] = React.useState<UserData | undefined>(undefined);
    const [loginResult, setLoginResult] = React.useState<loginResult | undefined>(undefined);
    const [isLogIn, setIsLogIn] = React.useState<boolean>(false);

    React.useEffect(() => {
        const storedUserData: any = localStorage.getItem('UserData');
        const storedLoginResult: any = localStorage.getItem('loginResult');
        const presUserData: UserData = JSON.parse(storedUserData);
        const presLoginResult: loginResult = JSON.parse(storedLoginResult)
        if (storedUserData && storedLoginResult) {
            initializeFirebase()
            setUserData(presUserData);
            setLoginResult(presLoginResult);
            setIsLogIn(true);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { loginResult, UserData } = await loginUser({ username: email, password: password });
            if (UserData) {
                initializeFirebase()
                localStorage.setItem('UserData', JSON.stringify(UserData));
                localStorage.setItem('loginResult', JSON.stringify(loginResult));
                setUserData(UserData)
                setLoginResult(loginResult)
                setIsLogIn(true)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {!isLogIn
                ? <Login login={login} />
                : (userData && loginResult && <KanbanBoard UserData={userData} loginResult={loginResult} />)}
        </>
    )
}