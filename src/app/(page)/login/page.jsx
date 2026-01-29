"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Login() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.usertype === '2') router.push('/admin');
        else if (session) router.push('/user/dashboard');
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await signIn('credentials', { phone, password, redirect: false });
        if (res?.error) {
            setError('The credentials provided are incorrect.');
            setLoading(false);
        }
    };

    return (
        <div className='bg-[#f8fafc] flex justify-center items-center min-h-screen p-4'>
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-700"></div>

            <div className='bg-white p-8 sm:p-10 rounded-2xl shadow-xl max-w-md w-full border border-gray-100'>
                <div className="text-center mb-8">
                    <h2 className='text-3xl font-bold text-[#2d2849]'>Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in with your phone number</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-50 text-xs text-red-600 rounded-lg text-center border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className="space-y-1">
                        <label className='text-xs font-semibold text-gray-600 uppercase ml-1'>Phone Number</label>
                        <PhoneInput
                            country={'in'}
                            value={phone}
                            onChange={(val) => setPhone(val)}
                            inputStyle={{ width: '100%', height: '44px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
                            buttonStyle={{ borderRadius: '12px 0 0 12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className='text-xs font-semibold text-gray-600 uppercase ml-1'>Password</label>
                        <input
                            type="password"
                            placeholder="••••••"
                            className='w-full px-4 py-2.5 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-amber-700 focus:bg-white outline-none transition-all'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={loading || phone.length < 10}
                        className='w-full py-3 bg-[#2d2849] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-[#1f1b33] disabled:bg-gray-400 transform active:scale-95 transition-all'
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        New here? <Link href="/register" className="text-amber-700 font-bold hover:underline">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}