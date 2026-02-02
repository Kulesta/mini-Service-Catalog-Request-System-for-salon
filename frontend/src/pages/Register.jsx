import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        company_name: '',
        license_number: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register as a Provider
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {success ? (
                        <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
                            Registration successful! Redirecting to login...
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-3 text-red-700 bg-red-100 rounded">
                                    {error}
                                </div>
                            )}

                            {['full_name', 'email', 'phone', 'company_name', 'license_number'].map((field) => (
                                <div key={field}>
                                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                                        {field.replace('_', ' ')}
                                    </label>
                                    <div className="mt-1">
                                        {field === 'phone' ? (
                                            <PhoneInput
                                                id={field}
                                                name={field}
                                                defaultCountry="US"
                                                value={formData[field]}
                                                onChange={(value) => setFormData({ ...formData, [field]: value })}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        ) : (
                                            <input
                                                id={field}
                                                name={field}
                                                type={field === 'email' ? 'email' : 'text'}
                                                required
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                value={formData[field]}
                                                onChange={handleChange}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label htmlFor="password" class="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Register
                                </button>
                            </div>
                        </form>
                    )}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
