import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        description: '',
        status: 'active'
    });
    const [imagePreview, setImagePreview] = useState('');

    const fetchCategories = async (opts = {}) => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/categories', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: opts.page ?? page,
                    limit: 10,
                    search: opts.search ?? search
                }
            });
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            const m = res.data.meta || { page: 1, limit: 10, total: data.length, totalPages: 1 };
            setCategories(data);
            setMeta(m);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/categories', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ title: '', image: '', description: '', status: 'active' });
            setImagePreview('');
            fetchCategories({ page: 1 });
            setPage(1);
        } catch (error) {
            console.error(error);
            alert('Failed to save category');
        }
    };

    const openCreate = () => {
        setEditingCategory(null);
        setFormData({ title: '', image: '', description: '', status: 'active' });
        setImagePreview('');
        setShowModal(true);
    };

    const openEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title || '',
            image: category.image || '',
            description: category.description || '',
            status: category.status || 'active'
        });
        setImagePreview(category.image || '');
        setShowModal(true);
    };

    const deleteCategory = async (category) => {
        const ok = confirm(`Delete category "${category.title}"?`);
        if (!ok) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/categories/${category._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories();
        } catch (error) {
            console.error(error);
            alert('Failed to delete category');
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Service Categories</h1>
                <button
                    onClick={openCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add Category
                </button>
            </div>

            <div className="mb-4 flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Search categories..."
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={() => {
                        setLoading(true);
                        setPage(1);
                        fetchCategories({ page: 1, search });
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                >
                    Search
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
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative h-10 w-10 flex-shrink-0 rounded border bg-gray-100 overflow-hidden">
                                                {category.image && (
                                                    <img
                                                        src={category.image}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            // If the URL is broken, remove the image and keep the gray fallback square.
                                                            e.currentTarget.remove();
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-blue-600 truncate">{category.title}</p>
                                        </div>
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
                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={() => openEdit(category)}
                                            className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCategory(category)}
                                            className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
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
                                fetchCategories({ page: next });
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
                                fetchCategories({ page: next });
                            }}
                            className={`px-3 py-1 rounded ${page >= meta.totalPages ? 'bg-gray-200 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-900'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Simple Modal for Adding Category */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">Icon/Image URL</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.image}
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        setImagePreview(e.target.value);
                                    }}
                                    placeholder="https://..."
                                />
                                <div className="mt-2">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Or Upload Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-700"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                const base64 = String(reader.result || '');
                                                setFormData(prev => ({ ...prev, image: base64 }));
                                                setImagePreview(base64);
                                            };
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-500 mb-1">Preview</p>
                                        <img
                                            src={imagePreview}
                                            alt=""
                                            className="h-20 w-20 rounded border object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">active</option>
                                    <option value="inactive">inactive</option>
                                </select>
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
                                    {editingCategory ? 'Update' : 'Save'}
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
