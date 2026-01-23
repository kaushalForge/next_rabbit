import Product from "@/components/pages/Product";

const page = async ({ params }) => {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      next: { revalidate: 60 },
    },
  );

  const productDetails = await res.json();

  return <Product productDetail={productDetails} productId={id} />;
};

export default page;
