import { Hind, Yatra_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
import { Analytics } from "@vercel/analytics/next";

const hind = Hind({
  subsets: ["latin"],
  variable: "--font-hind",
  weight: ["300", "400", "500", "600", "700"],
});

const yatra = Yatra_One({
  subsets: ["latin"],
  variable: "--font-yatra",
  weight: "400",
});

export const metadata = {
  title: "Wownutt | Premium Dry Fruits",
  description:
    "Wownutt brings you premium dry fruits inspired by Indian heritage and crafted for purity and taste.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${hind.variable} ${yatra.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
