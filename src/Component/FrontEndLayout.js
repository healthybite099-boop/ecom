import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function FrontEndLayout({ children }) {
    return (
        <>
            <Header />
             {children} 
            <Footer />
        </>
    );
}