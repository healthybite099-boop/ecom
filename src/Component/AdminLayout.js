import Header from "@/Component/Admin/Header";
export default function AdminLayout({ children }) {
    return (
        <>
        <Header/>
            {children}
        </>
    );
}
