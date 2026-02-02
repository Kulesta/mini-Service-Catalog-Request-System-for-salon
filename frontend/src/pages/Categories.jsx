import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'active'
    });

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/categories', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/categories', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setFormData({ title: '', description: '', status: 'active' });
            fetchCategories();
        } catch (error) {
            console.error(error);
            alert('Failed to create category');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Service Categories</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add Category
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <li key={category._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-blue-600 truncate">{category.title}</p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {category.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {categories.length === 0 && (
                            <li className="px-4 py-4 text-center text-gray-500">No categories found. Create one!</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Simple Modal for Adding Category */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Add Category</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
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

export default Categories;
