import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/redux/ReduxProvider";
import { Toaster } from "sonner";
import { Suspense } from "react";
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
};

export default async function AdminLayout({ children }) {
  // const { user, isLoggedIn } = await fetchAuthToken();

  // Redirect if user is not admin
  // if (user?.role !== "admin") {
  //   redirect("/not-found");
  // }

  // Render the admin layout
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Toaster position="top-right" richColors closeButton duration={1000} />
        <AuthProvider>
          <Suspense fallback={null}>
            <ReduxProvider>{children}</ReduxProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
