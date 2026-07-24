import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";

export default async function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
