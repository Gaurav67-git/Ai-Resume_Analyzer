import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => ([
    { title: "Resumind | Auth" },
    { name: "description", content: "Log into your account" },
]);

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Safe way to get "next" param
    const params = new URLSearchParams(location.search);
    const next = params.get("next") || "/";

    // ✅ Redirect after login
    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next, { replace: true });
        }
    }, [auth.isAuthenticated, navigate, next]);

    return (
        <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">

                    {/* Header */}
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold">Welcome</h1>
                        <h2 className="text-gray-600">
                            Log In to Continue Your Job Journey
                        </h2>
                    </div>

                    {/* Optional user info */}
                    {auth.user && (
                        <p className="text-center text-sm text-gray-500">
                            Logged in as: <span className="font-semibold">{auth.user.username}</span>
                        </p>
                    )}

                    {/* Auth Buttons */}
                    <div>
                        {isLoading ? (
                            <button
                                className="auth-button animate-pulse w-full"
                                disabled
                            >
                                <p>Signing you in...</p>
                            </button>
                        ) : auth.isAuthenticated ? (
                            <button
                                className="auth-button w-full bg-red-500 hover:bg-red-600"
                                onClick={auth.signOut}
                            >
                                <p>Logout</p>
                            </button>
                        ) : (
                            <button
                                className="auth-button w-full bg-green-500 hover:bg-green-600"
                                onClick={auth.signIn}
                            >
                                <p>Login</p>
                            </button>
                        )}
                    </div>

                </section>
            </div>
        </main>
    );
};

export default Auth;
