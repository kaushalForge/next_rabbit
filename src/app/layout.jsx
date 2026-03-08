import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ReactLenis } from "../lib/lenis";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rabbit",
  description:
    "Rabbit is Nepal's premier online shopping destination for fashion, accessories, and lifestyle products. Discover top-quality Nepali products, latest trends, and enjoy fast, reliable delivery across Nepal.",
  icons: {
    icon: "/images/Logo.png",
  },
};

export default async function AdminLayout({ children }) {
  return (
    <html lang="en">
      <ReactLenis root>
        <body
          suppressHydrationWarning //prevents hydration mismatch error to display on console
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster position="top-right" visibleToasts={4} duration={1200} />
          <Suspense>
            <AuthProvider>
              <CartProvider>
                <OrderProvider>{children}</OrderProvider>
              </CartProvider>
            </AuthProvider>
          </Suspense>
        </body>
      </ReactLenis>
    </html>
  );
}
