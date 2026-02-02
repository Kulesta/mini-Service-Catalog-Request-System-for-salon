import Layout from '../components/Layout';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-6">Welcome back, {user?.full_name}!</p>

            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Your Public Catalog Link</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Share this link with your customers so they can view your services and submit requests.</p>
                    </div>
                    <div className="mt-5">
                        <a
                            href={`/public/${user?._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 text-lg font-medium"
                        >
                            {window.location.origin}/public/{user?._id}
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
