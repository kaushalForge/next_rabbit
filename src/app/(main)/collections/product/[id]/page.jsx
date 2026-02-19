import Product from "@/components/pages/Product";
import NotFound from "@/app/404/page";

const page = async ({ params }) => {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  const productDetails = await res.json();
  const { name } = await productDetails;

  if (name) {
    return <Product productDetail={productDetails} productId={id} />;
  } else {
    return <NotFound />;
  }
};

export default page;
