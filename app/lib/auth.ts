export const isAuthenticated = () => {
    return localStorage.getItem("user") !== null;
};

export const login = (username: string) => {
    localStorage.setItem("user", username);
};

export const logout = () => {
    localStorage.removeItem("user");
};