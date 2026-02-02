import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Services = () => {
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [formData, setFormData] = useState({
        service_name: '',
        category_id: '',
        base_price: '',
        vat_percent: 0,
        discount_amount: 0,
        image: ''
    });

    const fetchData = async (opts = {}) => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [servicesRes, categoriesRes] = await Promise.all([
                api.get('/services', {
                    headers,
                    params: {
                        page: opts.page ?? page,
                        limit: 10,
                        search: opts.search ?? search,
                        category: opts.category ?? categoryFilter
                    }
                }),
                api.get('/categories', { headers })
            ]);

            const servicesData = Array.isArray(servicesRes.data) ? servicesRes.data : (servicesRes.data.data || []);
            const servicesMeta = servicesRes.data.meta || { page: 1, limit: 10, total: servicesData.length, totalPages: 1 };

            const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : (categoriesRes.data.data || []);
            setServices(servicesData);
            setMeta(servicesMeta);
            setCategories(categoriesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingService) {
                await api.put(`/services/${editingService._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/services', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            setEditingService(null);
            setFormData({
                service_name: '',
                category_id: '',
                base_price: '',
                vat_percent: 0,
                discount_amount: 0,
                image: ''
            });
            setPage(1);
            fetchData({ page: 1 });
        } catch (error) {
            console.error(error);
            alert('Failed to save service');
        }
    };

    const openCreate = () => {
        setEditingService(null);
        setFormData({
            service_name: '',
            category_id: '',
            base_price: '',
            vat_percent: 0,
            discount_amount: 0,
            image: ''
        });
        setShowModal(true);
    };

    const openEdit = (service) => {
        setEditingService(service);
        setFormData({
            service_name: service.service_name || '',
            category_id: service.category?._id || service.category || '',
            base_price: service.base_price ?? '',
            vat_percent: service.vat_percent ?? 0,
            discount_amount: service.discount_amount ?? 0,
            image: service.image || ''
        });
        setShowModal(true);
    };

    const deleteService = async (service) => {
        const ok = confirm(`Delete service "${service.service_name}"?`);
        if (!ok) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/services/${service._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to delete service');
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
                    onClick={openCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add Service
                </button>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full sm:max-w-md px-3 py-2 border border-gray-300 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All categories</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.title}</option>
                    ))}
                </select>
                <button
                    onClick={() => {
                        setLoading(true);
                        setPage(1);
                        fetchData({ page: 1, search, category: categoryFilter });
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                >
                    Apply
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
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative h-10 w-10 flex-shrink-0 rounded border bg-gray-100 overflow-hidden">
                                            {service.image && (
                                                <img
                                                    src={service.image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.remove();
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-sm font-medium text-blue-600 truncate">{service.service_name}</p>
                                            <p className="text-xs text-gray-400 truncate">{service.category?.title}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-900">${service.total_price?.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">Base: ${service.base_price}</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => openEdit(service)}
                                        className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteService(service)}
                                        className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                        {services.length === 0 && (
                            <li className="px-4 py-4 text-center text-gray-500">No services found. Add one!</li>
                        )}
                    </ul>
                </div>
            )}

            {!loading && meta.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Page {meta.page} of {meta.totalPages} (total {meta.total})
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => {
                                const next = Math.max(page - 1, 1);
                                setPage(next);
                                setLoading(true);
                                fetchData({ page: next });
                            }}
                            className={`px-3 py-1 rounded ${page <= 1 ? 'bg-gray-200 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                        >
                            Prev
                        </button>
                        <button
                            disabled={page >= meta.totalPages}
                            onClick={() => {
                                const next = Math.min(page + 1, meta.totalPages);
                                setPage(next);
                                setLoading(true);
                                fetchData({ page: next });
                            }}
                            className={`px-3 py-1 rounded ${page >= meta.totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'Add Service'}</h2>
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

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Image URL (optional)</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
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
                                    {editingService ? 'Update' : 'Save'}
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
