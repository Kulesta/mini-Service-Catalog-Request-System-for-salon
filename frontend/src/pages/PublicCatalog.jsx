import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { validateLength, validatePhoneE164, validateRequired } from '../utils/validation';

const PublicCatalog = () => {
    const { providerId, slug } = useParams();
    const [provider, setProvider] = useState(null);
    const [catalog, setCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedServices, setSelectedServices] = useState([]);
    const [requestForm, setRequestForm] = useState({
        customerName: '',
        customerPhone: '',
        customerNote: ''
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const res = slug
                    ? await api.get(`/public/services/${slug}`)
                    : await api.get(`/public/${providerId}`);
                setProvider(res.data.provider);
                setCatalog(res.data.catalog);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching catalog", error);
                setLoading(false);
            }
        };

        if (slug || providerId) {
            fetchCatalog();
        }
    }, [providerId, slug]);

    const toggleService = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(selectedServices.filter(id => id !== serviceId));
        } else {
            setSelectedServices([...selectedServices, serviceId]);
        }
    };

    const selectedTotal = catalog
        .flatMap(c => c.services || [])
        .filter(s => selectedServices.includes(s._id))
        .reduce((sum, s) => sum + (Number(s.total_price) || 0), 0);

    const validateRequest = (data) => {
        const errs = {};
        errs.customerName =
            validateRequired(data.customerName, 'Your name') ||
            validateLength(data.customerName, { min: 2, max: 80 }, 'Your name');

        // Using E.164 via PhoneInput (includes country code like +1...)
        errs.customerPhone =
            validateRequired(data.customerPhone, 'Phone number') ||
            validatePhoneE164(data.customerPhone, 'phone number');

        Object.keys(errs).forEach((k) => {
            if (!errs[k]) delete errs[k];
        });
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateRequest(requestForm);
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;
        try {
            await api.post('/public/request', {
                providerId: provider?._id || providerId,
                serviceIds: selectedServices,
                ...requestForm
            });
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert('Failed to submit request');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Catalog...</div>;
    if (!provider) return <div className="p-10 text-center">Provider not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">{provider.company_name}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {provider.full_name} | {provider.email} | {provider.phone}
                    </p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {submitted ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> Your request has been sent to {provider.company_name}. They will contact you shortly.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Catalog Column */}
                        <div className="md:col-span-2 space-y-6">
                            {catalog.map(category => (
                                <div key={category._id} className="bg-white shadow sm:rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {category.title}
                                        </h3>
                                        {category.description && <p className="mt-1 max-w-2xl text-sm text-gray-500">{category.description}</p>}
                                    </div>
                                    <ul className="divide-y divide-gray-200">
                                        {category.services.map(service => (
                                            <li key={service._id} className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => toggleService(service._id)}>
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedServices.includes(service._id)}
                                                        onChange={() => { }}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{service.service_name}</p>
                                                        {Number(service.discount_amount) > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm text-gray-500">
                                                                    <span className="line-through">
                                                                        ${(
                                                                            Number(service.base_price) +
                                                                            (Number(service.base_price) * Number(service.vat_percent || 0) / 100)
                                                                        ).toFixed(2)}
                                                                    </span>
                                                                    <span className="ml-2 font-semibold text-gray-900">
                                                                        ${Number(service.total_price).toFixed(2)}
                                                                    </span>
                                                                </p>
                                                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                                    -${Number(service.discount_amount).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-500">${Number(service.total_price).toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                        {category.services.length === 0 && <li className="px-4 py-4 text-sm text-gray-500">No services available</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Request Form Column */}
                        <div className="md:col-span-1">
                            <div className="bg-white shadow sm:rounded-lg sticky top-6">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Request Services</h3>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500">Selected Services: {selectedServices.length}</p>
                                    </div>

                                    <div className="mb-4 p-3 bg-gray-50 border rounded">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Selected Total</span>
                                            <span className="text-lg font-bold text-gray-900">
                                                ${selectedTotal.toFixed(2)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            Includes VAT and discounts where applicable.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                                    value={requestForm.customerName}
                                                    onChange={e => {
                                                        setRequestForm({ ...requestForm, customerName: e.target.value });
                                                        if (fieldErrors.customerName) {
                                                            setFieldErrors(prev => ({ ...prev, customerName: '' }));
                                                        }
                                                    }}
                                                />
                                                {fieldErrors.customerName && (
                                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.customerName}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                                <PhoneInput
                                                    defaultCountry="US"
                                                    value={requestForm.customerPhone}
                                                    onChange={(value) => {
                                                        setRequestForm({ ...requestForm, customerPhone: value || '' });
                                                        if (fieldErrors.customerPhone) {
                                                            setFieldErrors(prev => ({ ...prev, customerPhone: '' }));
                                                        }
                                                    }}
                                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                                />
                                                {fieldErrors.customerPhone && (
                                                    <p className="mt-1 text-sm text-red-600">{fieldErrors.customerPhone}</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
                                                <textarea
                                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                                    rows="3"
                                                    value={requestForm.customerNote}
                                                    onChange={e => setRequestForm({ ...requestForm, customerNote: e.target.value })}
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={selectedServices.length === 0}
                                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${selectedServices.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                            >
                                                Submit Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PublicCatalog;
