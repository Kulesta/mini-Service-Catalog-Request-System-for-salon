import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token
            const res = await api.get('/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests", error);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/requests/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests(); // Refresh
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Incoming Requests</h1>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {requests.map((req) => (
                        <li key={req._id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">
                                        {req.customer_name} ({req.customer_phone})
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                req.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {req.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Services: {req.services.map(s => s.service_name).join(', ')}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex flex-col items-end text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            {new Date(req.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            Total:{' '}
                                            {req.services && req.services.length > 0
                                                ? `$${req.services
                                                    .reduce((sum, s) => sum + (Number(s.total_price) ||
                                                        ((Number(s.base_price) || 0) +
                                                            (Number(s.base_price || 0) * Number(s.vat_percent || 0) / 100) -
                                                            (Number(s.discount_amount) || 0)
                                                        )), 0)
                                                    .toFixed(2)}`
                                                : '$0.00'}
                                        </p>
                                    </div>
                                </div>
                                {req.customer_note && (
                                    <div className="mt-2 text-sm text-gray-500 italic">
                                        "{req.customer_note}"
                                    </div>
                                )}
                                <div className="mt-4 flex space-x-3">
                                    {req.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(req._id, 'completed')}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                                            >
                                                Mark Completed
                                            </button>
                                            <button
                                                onClick={() => updateStatus(req._id, 'cancelled')}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                    {requests.length === 0 && <li className="px-4 py-4 text-center text-gray-500">No requests yet.</li>}
                </ul>
            </div>
        </Layout>
    );
};

export default Requests;
