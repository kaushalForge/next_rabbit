import Header from "@/components/Common/Header";
// import { fetchCurrentUser } from "@/actions/authorization";

export default async function MainLayout({ children }) {
  // const data = await fetchCurrentUser();
  // console.log(data);
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
