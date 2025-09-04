"use client"

import React from "react"
import {LoginForm} from "./LoginForm"


export default function Login() {
    return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to TrackStock</h1>
            <p className="text-muted-foreground">Login with your account</p>
        </div>
        <LoginForm />
    </div>
    )
}