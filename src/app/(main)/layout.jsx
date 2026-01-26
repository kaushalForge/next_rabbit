import Header from "@/components/Common/Header";

export default async function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
