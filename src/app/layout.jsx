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
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://next-rabbit.vercel.app"),
  title: {
    default: "Rabbit House - Dress Well, Live Better",
    template: "%s - Rabbit House",
  },
  description:
    "Rabbit House is a premium online clothing store offering stylish outfits, modern fashion, and comfortable everyday wear for men and women.",
  openGraph: {
    title: "Rabbit House - Dress Well, Live Better",
    siteName: "Rabbit House",
    images: [
      {
        url: "/assets/rabbit-banner.png",
        width: 1200,
        height: 630,
        alt: "Rabbit House Clothing - Dress Well, Live Better",
      },
    ],
    type: "website",
  },
};

export default async function AdminLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
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
