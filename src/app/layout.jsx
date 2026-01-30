import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/redux/ReduxProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

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
      <body
        suppressHydrationWarning //prevents hydration mismatch error to display on console
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" richColors closeButton duration={1000} />
        <AuthProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
