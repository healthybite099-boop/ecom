import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import WhatsAppButton from "../WhatsAppButton";

export default function Footer() {
  return (
    <footer className="bg-[#f9f6ef] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Logo + Social */}
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/img/logobg.png"
              alt="Logo"
              width={130}
              height={50}
            />
          </Link>

          <p className="mt-4 text-sm font-semibold text-[#653825] max-w-md">
            Wownutt brings you premium dry fruits, carefully sourced for freshness, taste, and everyday wellness.
          </p>


          <div className="flex gap-5 mt-6">
            {[
              { icon: FaFacebookF, link: "https://facebook.com" },
              { icon: FaInstagram, link: "https://instagram.com" },
              { icon: FaTwitter, link: "https://twitter.com" },
              { icon: FaLinkedinIn, link: "https://linkedin.com" },
            ].map(({ icon: Icon, link }, i) => (
              <Link
                key={i}
                href={link}
                target="_blank"
                className="text-[#653825] hover:text-[#000000] transition"
              >
                <Icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

      
      </div>
    </footer>
  );
}
