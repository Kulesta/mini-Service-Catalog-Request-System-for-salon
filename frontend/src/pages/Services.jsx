import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Services = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        service_name: '',
        category_id: '',
        base_price: '',
        vat_percent: 0,
        discount_amount: 0,
        image: ''
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [servicesRes, categoriesRes] = await Promise.all([
                api.get('/services', { headers }),
                api.get('/categories', { headers })
            ]);

            setServices(servicesRes.data);
            setCategories(categoriesRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/services', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setFormData({
                service_name: '',
                category_id: '',
                base_price: '',
                vat_percent: 0,
                discount_amount: 0,
                image: ''
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to create service');
        }
    };

    // Helper to calculate price client-side for preview (optional, since backend sends it too)
    const calculateTotal = (base, vat, discount) => {
        const b = parseFloat(base) || 0;
        const v = parseFloat(vat) || 0;
        const d = parseFloat(discount) || 0;
        return (b + (b * v / 100)) - d;
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add Service
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {services.map((service) => (
                            <li key={service._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-blue-600 truncate">{service.service_name}</p>
                                        <p className="text-xs text-gray-400">{service.category?.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">${service.total_price?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Base: ${service.base_price}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {services.length === 0 && (
                            <li className="px-4 py-4 text-center text-gray-500">No services found. Add one!</li>
                        )}
                    </ul>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Service</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Service Name</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.service_name}
                                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Base Price</label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={formData.base_price}
                                        onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">VAT %</label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={formData.vat_percent}
                                        onChange={(e) => setFormData({ ...formData, vat_percent: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Discount Amount</label>
                                <input
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.discount_amount}
                                    onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
                                />
                            </div>

                            <div className="mb-4 p-2 bg-gray-100 rounded text-right">
                                <span className="text-sm font-bold text-gray-600">Total Price: </span>
                                <span className="text-lg font-bold text-green-600">
                                    ${calculateTotal(formData.base_price, formData.vat_percent, formData.discount_amount).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Services;
