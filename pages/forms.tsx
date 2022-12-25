import React, { use, useState } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";

interface LoginFrom {
    username:string;
    password:string;
    email: string;
}

export default function Forms() {
    const { register, handleSubmit } = useForm<LoginFrom>();
    const onValid = (data:LoginFrom) => {
        console.log("I'm valid!");
    }

    const onInvalid = (errors:FieldErrors) => {
        console.log(errors);
    }

    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input 
                {...register("username", {
                    required: "Username is required!",
                    minLength: {
                        message: "The Username should be longer than 5 characters",
                        value: 5,
                    }
                })}
                type="text" 
                placeholder="Username" 
            />
            <input 
                {...register("email", {
                    required: "Email is required!",
                })}
                type="email" 
                placeholder="Email" 
            />
            <input
                {...register("password", {
                    required: "Password is required!",
                })}
                type="password" 
                placeholder="Password" 
            />
            <input type="submit" value="Create Account" />
        </form>
    );
}