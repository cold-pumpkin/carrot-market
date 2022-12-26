import React, { use, useState } from "react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";

// React Hook Form Practice
interface LoginFrom {
    username: string;
    password: string;
    email: string;
    errors?: string;
}

export default function Forms() {
    const { 
        register, 
        handleSubmit,
        formState: {
            errors
        },
        watch,
        setError,
        setValue,
        reset,
        resetField
    } = useForm<LoginFrom>({
        mode: "onChange"
    });

    const onValid = (data:LoginFrom) => {
        console.log("I'm valid!");
        
        // if user name alreay exists 
        setError("username", {
            message: "Username alreay exists!"
        });
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
            {/* {errors.username?.message} */}

            <input 
                {...register("email", {
                    required: "Email is required!",
                    validate: {
                        notGmail: (value) => !value.includes("@gmail.com") || "Gmail is not allowed",
                    }
                })}
                type="email" 
                placeholder="Email" 
                className={`${Boolean(errors.email) ? "border-red-700" : ""}`}
            />
            {errors.email?.message}

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