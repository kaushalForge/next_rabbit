import Login from "@/components/pages/Login";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense>
        <Login />
      </Suspense>
    </>
  );
};

export default page;
