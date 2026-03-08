import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ReactLenis } from "../lib/lenis";
import { Suspense } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap", // ← prevents invisible text while loading
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
    <html lang="en" className={outfit.variable}>
      <ReactLenis root>
        <body
          suppressHydrationWarning
          className={`${outfit.className} antialiased`}
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
