import React, { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

    const updateUser = (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const updateToken = (token) => {
        localStorage.setItem("token", JSON.stringify(token));
    };

    const cleanup = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, updateUser, updateToken, cleanup }}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
