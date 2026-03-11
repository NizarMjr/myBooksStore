import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
    const { token, user, setUser, login, logout, authFetch, categories,
        setCategories, favorites, setFavorites } = useContext(AuthContext);

    return {
        token, user, setUser, login, logout, authFetch, categories,
        setCategories, favorites, setFavorites
    };
};