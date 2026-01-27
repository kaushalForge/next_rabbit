// "use client";
import { cookies } from "next/headers";

const Test = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser").value;

  const res = await fetch("/api/admin/products", {
    method: "GET",
    headers: {
      Cookie: `cUser=${token}`,
    },
    cache: "no-store",
  });

  const result = await res.json();
  console.log(result);

  return <div>hi</div>;
};

export default Test;
