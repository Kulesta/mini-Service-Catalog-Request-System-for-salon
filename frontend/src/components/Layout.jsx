import { useNavigate, useLocation, Link } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Categories', path: '/categories' },
        { name: 'Services', path: '/services' },
        { name: 'Requests', path: '/requests' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r">
                <div className="flex items-center justify-center h-16 border-b">
                    <span className="text-xl font-bold text-gray-800">Salon Admin</span>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 ${location.pathname === item.path ? 'bg-gray-200 font-medium' : ''
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t">
                    <div className="flex items-center">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b lg:hidden">
                    <span className="text-xl font-bold text-gray-800">Salon Admin</span>
                    <button onClick={handleLogout} className="text-gray-500 focus:outline-none">
                        Logout
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
