// // app/api/products/search/route.js
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);

//     // Backend URL
//     const backendUrl = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search`);

//     // Allowed query params to forward to backend
//     const allowedParams = ["search", "category", "color", "size", "brand", "material"];
//     for (const key of allowedParams) {
//       const value = searchParams.get(key);
//       if (value) backendUrl.searchParams.set(key, value);
//     }

//     // Fetch from backend
//     const res = await fetch(backendUrl.toString(), {
//       // Optional headers
//       // headers: { Authorization: `Bearer ${process.env.BACKEND_TOKEN}` }
//     });

//     if (!res.ok) {
//       console.error("Backend fetch failed:", res.status, await res.text());
//       return NextResponse.json([], { status: 500 });
//     }

//     const data = await res.json();

//     // Always return an array
//     const products = Array.isArray(data) ? data : data.products || [];

//     return NextResponse.json(products);
//   } catch (err) {
//     console.error("API /products/search error:", err);
//     return NextResponse.json([], { status: 500 });
//   }
// }
