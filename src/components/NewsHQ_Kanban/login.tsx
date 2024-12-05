//@ts-ignore
'use client';

import React from "react";
import { useForm, Controller } from 'react-hook-form';
import './login.scss';

interface Props {
    login: (email: string, password: string) => Promise<void>;
}
interface loginType {
    email: string;
    password: string;
}

export const Login = ({ login }: Props) => {
    const { handleSubmit, control, formState: { errors } } = useForm<loginType>({
        defaultValues: {
            password: '',
            email: '',
        }
    });

    const onSubmit = async (formData: { email: string; password: string }) => {
        login(formData.email, formData.password);
    };

    return (
        <section className="bg-gray-100 dark:bg-gray-900 h-full w-full mt-7">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  max-w-[500px]">
                <a id="logo-v3" className="flex items-center mb-6 text-2xl font-semibold text-gray-900" />
                <div className="w-full bg-white rounded-lg shadow">
                    <div className="p-6 space-y-4">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900">
                            Sign in to your account
                        </h1>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: 'Email is required' }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="email"
                                            id="email"
                                            className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errors.email ? 'border-red-500' : ''}`}
                                            placeholder="name@company.com"
                                        />
                                    )}
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: 'Password is required' }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="password"
                                            id="password"
                                            className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${errors.password ? 'border-red-500' : ''}`}
                                            placeholder="••••••••"
                                        />
                                    )}
                                />
                                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
