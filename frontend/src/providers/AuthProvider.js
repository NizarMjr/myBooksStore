import { useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const logout = async () => {
        setToken(null);
        setUser(null);
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/logout`, {
            method: "POST",
            credentials: "include",
        });
        if (res.ok) {
            alert("تم تسجيل الخروج بنجاح");
            window.location.href = "/";
        } else {
            alert("فشل تسجيل الخروج");
        }
    };
    const getCategories = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/categories`);
            const data = await res.json();
            if (data.categories)
                setCategories(data.categories);

        } catch (err) {
            console.error('Error fetching categories', err);
        }
    };
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/refresh`, {
                    method: "POST",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setToken(data.accessToken);
                    setUser(data.user);
                    setFavorites(data.user.favorites)
                }
            } catch (err) {
                console.log("No active session found");
            } finally {
                setLoading(false);
            }
        };
        checkSession();
        getCategories();
    }, []);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
    };

    const authFetch = async (url, options = {}) => {
        options.headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
        };
        if (!(options.body instanceof FormData)) {
            options.headers["Content-Type"] = "application/json";
        }
        options.credentials = "include";

        try {
            let response = await fetch(url, options);

            if (response.status === 401) {
                const refreshRes = await fetch(`${process.env.REACT_APP_SERVER_URL}/refresh`, {
                    method: "POST",
                    credentials: "include",
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    const newToken = data.accessToken;

                    setToken(newToken);
                    if (data.user) setUser(data.user);

                    options.headers["Authorization"] = `Bearer ${newToken}`;
                    response = await fetch(url, options);
                } else {
                    logout();
                }
            }
            return response;
        } catch (error) {
            console.error("AuthFetch Error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, setUser, login, logout, authFetch, loading, categories, setCategories, favorites, setFavorites }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}