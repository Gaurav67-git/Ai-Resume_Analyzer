import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const Navbar = () => {
    const { auth, isLoading } = usePuterStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/auth");
    };

    return (
        <nav className="flex flex-row justify-between items-center gap-6 w-full max-w-[1200px] mx-auto px-6">
            <div className="navbar flex-1">
                <Link to="/">
                    <p className="text-2xl font-bold text-gradient">
                        RESUMIND
                    </p>
                </Link>

                {isLoading ? (
                    <span className="text-sm text-gray-500">Checking...</span>
                ) : auth.isAuthenticated && (
                        <Link to="/upload" className="primary-button w-fit">
                            Upload Resume
                        </Link>
                )}
            </div>

            {!isLoading && (
                auth.isAuthenticated ? (
                    <div className="flex items-center gap-3 shrink-0">
                        {auth.user?.username && (
                            <span className="hidden sm:block text-sm font-semibold text-gray-800">
                                {auth.user.username}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="secondary-button w-fit"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/auth" className="primary-button w-fit">
                        Login
                    </Link>
                )
            )}
        </nav>
    );
};

export default Navbar;
