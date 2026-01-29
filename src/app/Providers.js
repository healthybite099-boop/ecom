"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from 'next/navigation';
import FrontEndLayout from "@/Component/FrontEndLayout";
import AdminLayout from "@/Component/AdminLayout";

export const AuthProvider = ({ children }) => {
    const pathname = usePathname();

    const isAdminRoute = pathname.startsWith('/admin');

    return <SessionProvider>
        {isAdminRoute ? (
            <AdminLayout>{children}</AdminLayout>
        ) : (
            <FrontEndLayout>{children}</FrontEndLayout>
        )}

    </SessionProvider>;
}
