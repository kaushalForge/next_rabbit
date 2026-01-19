export async function fetchCollection({ collection, searchParams }) {
  const query = new URLSearchParams(searchParams).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?collection=${collection}&${query}`,
    {
      cache: "no-store", // always fresh
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch collection");
  }

  return res.json();
}
