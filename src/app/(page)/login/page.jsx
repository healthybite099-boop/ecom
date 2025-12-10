'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            // Redirect to the dashboard if the user is already logged in
            router.push('/admin');
        }
    }, [session, router]);
    const isFormValid = () => {
        return Object.values(formData).every(field => field.trim() !== '');
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false
            });

            if (res.error) {
                setError('Invalid Credentials');
                setLoading(false);
                return;
            }

            router.push('/admin'); // Redirect to the dashboard after successful login
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setError('Server error: ' + (error.response.data.message || 'An error occurred.'));
            } else {
                setError('Invalid Credentials. Please try again.');
            }
            setLoading(false);
        }
    };

    return (
        <div className='bg-slate-100 flex justify-center items-center min-h-screen relative'>
            <div className='absolute inset-0 bg-opacity-50 backdrop-blur-sm'></div>

            <div className='relative z-30 bg-white p-10 rounded-xl shadow-2xl max-w-md w-full'>
                <h2 className='text-4xl font-bold mb-8 text-center text-gray-800'>Sign In</h2>

                {error && (
                    <div className="text-red-600 text-center mb-4 animate-bounce">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='w-full'>
                        <label className='block text-lg font-medium text-gray-700 mb-2' htmlFor="email">
                            Email
                        </label>
                        <input
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#005ca8] hover:shadow-md bg-gray-100'
                            placeholder="Enter your email"
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className='w-full'>
                        <label className='block text-lg font-medium text-gray-700 mb-2' htmlFor="password">
                            Password
                        </label>
                        <input
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out transform focus:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#005ca8] hover:shadow-md bg-gray-100'
                            placeholder="Enter your password"
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={!isFormValid() || loading}
                        className={`w-full py-2 px-4 rounded-lg shadow-lg transform transition duration-300 ease-in-out ${isFormValid() ? 'bg-[#2d2849] text-white hover:bg-[#2d2849] hover:scale-105' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            } focus:outline-none focus:ring-2 focus:ring-[#005ca8]`}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>


                </form>
            </div>
        </div>
    );
}
