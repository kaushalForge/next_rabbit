import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { ReactLenis } from "../lib/lenis";
import { Suspense } from "react";
import ScrollToTop from "../components/Helper/ScrollToTop";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://next-rabbit.vercel.app"),
  title: {
    default: "RabbitHub Nepal | Fashion Store – Trendy Clothing & Outfits",
    template: "%s | RabbitHub Nepal",
  },
  description:
    "Shop trendy fashion online in Nepal at RabbitHub. Premium clothing for men and women with delivery across Kathmandu, Pokhara and all Nepal.",
  openGraph: {
    title: "RabbitHub Nepal | Fashion Store – Trendy Clothing & Outfits",
    siteName: "RabbitHub Nepal",
    images: [
      {
        url: "/assets/rabbit-banner.png",
        width: 1200,
        height: 630,
        alt: "RabbitHub Clothing - Dress Well, Live Better",
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
          className={`${outfit.className} antialiased min-h-screen flex flex-col`}
        >
          <Toaster position="top-right" visibleToasts={4} duration={1200} />
          <Suspense>
            <AuthProvider>
              <CartProvider>
                <ScrollToTop />
                <OrderProvider>{children}</OrderProvider>
              </CartProvider>
            </AuthProvider>
          </Suspense>
        </body>
      </ReactLenis>
    </html>
  );
}
