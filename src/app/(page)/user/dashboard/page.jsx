"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function LogoutPage() {
  const { data: session, status } = useSession();

  // Handle Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-sm font-medium text-slate-500">
          Verifying session...
        </div>
      </div>
    );
  }

  // Handle Unauthenticated State
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Not Logged In</h2>
          <p className="text-sm text-slate-500 mb-6">Please sign in to access your account settings.</p>
          <Link
            href="/login"
            className="inline-block w-full px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* User Profile Header */}
        <div className="p-8 pb-4 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-4">
            {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {session?.user?.name || "User Account"}
          </h1>
          <p className="text-sm text-slate-500">{session?.user?.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="p-8 pt-4 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center w-full px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Return Home
          </Link>
          
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full px-5 py-3 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Secure Session Active
          </p>
        </div>
      </div>
    </div>
  );
}