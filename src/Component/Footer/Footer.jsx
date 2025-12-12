import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm py-5" role="contentinfo">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ecom</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your one-stop solution for premium products.  
              Delivering quality and trust since 2023.
            </p>
          </div>

          <nav aria-label="Company">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              
              <li>
                <Link href="/Cart" className="text-gray-600 hover:text-gray-900">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/Aboutus" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/Contactus" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-600 hover:text-gray-900">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Social Media">
            <h3 className="text-sm font-semibold text-gray-900 uppercase">
              Follow Us
            </h3>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook className="w-6 h-6 text-gray-600 hover:text-blue-600" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter className="w-6 h-6 text-gray-600 hover:text-blue-400" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className="w-6 h-6 text-gray-600 hover:text-pink-500" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-6 h-6 text-gray-600 hover:text-blue-700" />
              </Link>
            </div>
          </nav>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <span className="text-sm text-gray-500">
            © {new Date().getFullYear()} AK™. All Rights Reserved.
          </span>
          <span className="text-sm text-gray-500">
            Made with ❤️ by Parmjeet Rathore
          </span>
        </div>
      </div>
    </footer>
  );
}
